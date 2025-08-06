from django.shortcuts import get_object_or_404, redirect, render
from django.http import JsonResponse, HttpResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login as django_login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.template.loader import get_template
import json
from xhtml2pdf import pisa
from django.contrib import messages
from store.models import Product, Category, Order, OrderItem, Payment, Cart, CartItem, Customer, Review, TrackingDetails
from django.db import IntegrityError
from django.db.models import Q



# Create your views here.

def search(request):
    categories = Category.objects.all()
    products = Product.objects.all()

    # Pass categories and products to the context
    return render(request, "base_withsearch.html", {
        'categories': categories,
        'products': products,
    })


def search_products(request):
    query = request.GET.get('q', '')  # Retrieve the query parameter
    categories = Category.objects.all()
    products = Product.objects.filter(
        Q(name__icontains=query) | Q(description__icontains=query)
    ) if query else Product.objects.all()  # Search products based on query

    return render(request, 'search_results.html', {
        'categories': categories,
        'products': products,
        'query': query,
    })

def home(request):
    # Fetch all categories and products
    categories = Category.objects.all()
    
    # Fetch 10 products randomly 
    products = Product.objects.order_by('?')[:10]

    # Pass categories and products to the context
    return render(request, "home.html", {
        'categories': categories,
        'products': products,
    })


def about(request):

    categories = Category.objects.all()

    return render(request, "about.html", {'categories': categories})


def contact(request):
    return render(request, "contact.html")


@login_required
def userdashboard(request):
    # Get the logged-in user's customer instance
    customer = get_object_or_404(Customer, user=request.user)

    # Fetch orders for the logged-in customer
    orders = Order.objects.filter(customer=customer).order_by('-created_at')

    # Include tracking details directly in the orders queryset
    orders_with_tracking = [
        {
            "order": order,
            "tracking": TrackingDetails.objects.filter(order=order).last()
        }
        for order in orders
    ]

    context = {
        'customer': customer,
        'orders_with_tracking': orders_with_tracking,
    }
    return render(request, 'userdashboard.html', context)


@login_required
def order_details1(request, order_id):
    order = get_object_or_404(Order, id=order_id, customer__user=request.user)
    order_items = order.order_items.all()
    return render(request, 'order_details.html', {'order': order, 'order_items': order_items})

@login_required
def order_details(request, order_id):
    order = get_object_or_404(Order, id=order_id, customer__user=request.user)
    order_items = order.order_items.all()  # Ensure it fetches related order items
    tracking = TrackingDetails.objects.filter(order=order).last()

    context = {
        'order': order,
        'order_items': order_items,
        'tracking': tracking,
    }
    return render(request, 'order_details.html', context)



def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            django_login(request, user)
            messages.success(request, "Logged in successfully!")
            return redirect('home')  # Replace 'home' with your home page URL name
        else:
            messages.error(request, "Invalid username or password")
    
    return render(request, 'login.html')



# Signup view
def signup(request):
    if request.method == 'POST':
        username = request.POST.get('username').strip()
        email = request.POST.get('email').strip()
        password = request.POST.get('password')
        firstname = request.POST.get('firstname').strip()
        lastname = request.POST.get('lastname').strip()
        
        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists. Please choose a different one.")
        elif User.objects.filter(email=email).exists():
            messages.error(request, "Email already exists. Please use a different email address.")
        else:
            try:
                # Create user
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=firstname,
                    last_name=lastname
                )
                
                # Check if Customer already exists for the user
                if not Customer.objects.filter(user=user).exists():
                    Customer.objects.create(user=user, address="", city="", phone_number="")

                # Authenticate and log the user in
                user = authenticate(username=username, password=password)
                if user is not None:
                    django_login(request, user)  # Log the user in
                    messages.success(request, "Signup successful! Welcome!")
                    return redirect('home')  # Redirect to home page
            except IntegrityError as e:
                messages.error(request, "An error occurred during signup. Please try again.")

    return render(request, 'signup.html')



# Logout view (optional)
def logout_view(request):
    print("Logout view called")  # Debugging line
    logout(request)
    messages.success(request, "You have been logged out successfully.")
    return redirect('home')


# CART VIEW


@login_required
def cart_view(request):
    # Fetch the logged-in user's customer instance
    customer = get_object_or_404(Customer, user=request.user)
    shipping_rate = 80

    # Get or create the cart specific to the logged-in customer
    cart, created = Cart.objects.get_or_create(customer=customer)

    # Get items in the customer's cart
    cart_items = CartItem.objects.filter(cart=cart)

    # Calculate the total price
    total = sum(item.total_price for item in cart_items)

    after_shipping_rate = total + shipping_rate

    # Render the cart template
    return render(request, 'cart.html', {'cart_items': cart_items, 'total': total, 'shipping_rate': shipping_rate, 'after_shipping_rate': after_shipping_rate, 'products': Product.objects.all()})


@login_required
def add_to_cart(request, product_id):
    if request.method == 'GET':
        # Validate the product ID
        product = get_object_or_404(Product, id=product_id)

        # Get the Customer instance for the logged-in user
        customer = get_object_or_404(Customer, user=request.user)

        # Get or create the cart for the customer
        cart, created = Cart.objects.get_or_create(customer=customer)

        # Check if the product is already in the cart
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += 1  # Increment quantity if it already exists
        else:
            cart_item.quantity = 1  # Set quantity to 1 for a new item
        cart_item.save()

        # Add a success message
        messages.success(request, f'{product.name} added to cart successfully!')

        # Redirect back to the products page or the referring page
        return redirect(request.META.get('HTTP_REFERER', 'products'))

    messages.error(request, 'Invalid request method.')
    return redirect(request.META.get('HTTP_REFERER', 'products'))


   
        # # Fetch the logged-in user's customer instance
        # customer = get_object_or_404(Customer, user=request.user)

@login_required
def add_to_cart1(request, item_id):
    # Fetch the logged-in user's customer instance
    customer = get_object_or_404(Customer, user=request.user)

    # Fetch the cart item belonging to the logged-in customer's cart
    cart_item = get_object_or_404(CartItem, id=item_id, cart__customer=customer)

    # Delete the cart item
    cart_item.delete()

    # Redirect to the cart page
    return redirect('cart')



@login_required
def update_cart(request, item_id):
    if request.method == "POST":
        # Debugging log
        print(f"Updating cart for item ID: {item_id}")
        print(f"Request Data: {request.POST}")

        customer = get_object_or_404(Customer, user=request.user)
        cart_item = get_object_or_404(CartItem, id=item_id, cart__customer=customer)

        try:
            quantity = int(request.POST.get('quantity'))
            if quantity > 0:
                cart_item.quantity = quantity
                cart_item.save()

                item_total = cart_item.quantity * cart_item.product.price
                cart_total = sum(
                    item.quantity * item.product.price for item in cart_item.cart.items.all()
                )

                # Debugging log
                print(f"Updated item total: {item_total}, cart total: {cart_total}")

                return JsonResponse({
                    'success': True,
                    'message': 'Quantity updated successfully!',
                    'item_total': item_total,
                    'cart_total': cart_total,
                }, status=200)
            else:
                cart_item.delete()
                cart_total = sum(
                    item.quantity * item.product.price for item in cart_item.cart.items.all()
                )

                # Debugging log
                print(f"Item removed. Updated cart total: {cart_total}")

                return JsonResponse({
                    'success': True,
                    'message': 'Item removed from cart!',
                    'cart_total': cart_total,
                }, status=200)
        except ValueError as e:
            print(f"Invalid quantity error: {e}")
            return JsonResponse({'success': False, 'message': 'Invalid quantity.'}, status=400)

    # Debugging log for invalid request methods
    print("Invalid request method.")
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=400)


@login_required
def remove_from_cart(request, item_id):
    # Fetch the logged-in user's customer instance
    customer = get_object_or_404(Customer, user=request.user)

    # Fetch the cart item belonging to the logged-in customer's cart
    cart_item = get_object_or_404(CartItem, id=item_id, cart__customer=customer)

    # Delete the cart item
    cart_item.delete()

    # Redirect to the cart page
    return redirect('cart')


def categories(request):

    categories = Category.objects.all()

    return render(request, "categories.html", {'categories': categories})

def category_detail(request):
    return render(request, "category_detail.html")

def orders(request):
    return render(request, "orders.html")

def review_dashboard(request):
    return render(request, "review_dashboard.html")

def products(request):
    return render(request, "products.html")

def tracking(request):
    return render(request, "tracking.html")

@login_required
def checkout(request):
    # Ensure the user is logged in
    customer = get_object_or_404(Customer, user=request.user)
    
    # Fetch the cart for the logged-in customer
    cart = Cart.objects.filter(customer=customer).first()
    if not cart or not cart.items.exists():
        return render(request, 'checkout.html', {'cart': None})

    if request.method == "POST":
        # Extract form data
        address = request.POST.get('address')
        city = request.POST.get('city')
        phone_number = request.POST.get('phone')

        # Update customer details
        customer.address = address
        customer.city = city
        customer.phone_number = phone_number
        customer.save()

        # Extract other form data
        payment_method = request.POST.get('payment_method')
        payment_number = request.POST.get('payment_number', '')  # e.g., Last 4 digits or PayPal ID

        # Create an order
        order = Order.objects.create(
            customer=customer,
            total_amount=sum(item.total_price for item in cart.items.all()),
            created_at=timezone.now(),
            status="Pending",
        )

        # Create OrderItems for each CartItem
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
            )

        # Create and associate the Payment object
        Payment.objects.create(
            order=order,
            payment_method=payment_method,
            payment_number=payment_number,
            amount=order.total_amount,
        )

        # Clear the cart after creating the order
        cart.items.all().delete()

        # Redirect to a success page
        messages.success(request, "Your order has been placed successfully!")
        return redirect('order_success', order_id=order.id)

    return render(request, 'checkout.html', {'cart': cart})



@login_required
def order_success(request, order_id):
    order = get_object_or_404(Order, id=order_id, customer__user=request.user)
    payment = order.payment  # Access the related Payment object
    return render(request, 'order_success.html', {'order': order, 'payment': payment})



@login_required
def download_receipt(request, order_id):
    order = get_object_or_404(Order, id=order_id, customer__user=request.user)

    # Prepare context for the PDF
    context = {
        'order': order,
        'order_items': order.order_items.all(),
        'payment': order.payment,
        'tracking': TrackingDetails.objects.filter(order=order).last(),
    }

    # Load HTML template and render it
    template = get_template('receipt.html')
    html = template.render(context)

    # Create a PDF response
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="receipt_{order.id}.pdf"'

    # Generate PDF
    pisa_status = pisa.CreatePDF(html, dest=response)
    if pisa_status.err:
        return HttpResponse('Error generating PDF', status=500)
    return response


def products_view(request, category_id=None):
    # Fetch all categories for the dropdown menu
    categories = Category.objects.all()
    # If category_id is provided, filter products by that category, otherwise display all products
    if category_id:
        category = get_object_or_404(Category, id=category_id)
        products = Product.objects.filter(category=category)
    else:
        category = None
        products = Product.objects.all()

    # Pass products and categories to the template
    context = {
        'categories': categories,
        'products': products,
        'current_category': category,
    }
    return render(request, 'products.html', context)


@login_required
def submit_review(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    customer = get_object_or_404(Customer, user=request.user)

    if request.method == "POST":
        rating = request.POST.get("rating")
        comment = request.POST.get("comment")

        # Save the review
        Review.objects.create(
            customer=customer,
            product=product,
            rating=rating,
            comment=comment,
        )

        messages.success(request, "Thank you for your review!")
        return redirect("product_description", product_id=product.id)

    return redirect("product_description", product_id=product.id)



def product_description(request, product_id):
    print(f"Product ID: {product_id}")  # Debugging line
    product = get_object_or_404(Product, id=product_id)
    reviews = Review.objects.filter(product=product).order_by('-created_at')

    return render(request, "product_description.html", {
        "product": product,
        "reviews": reviews,
    })

# def product_list(request):
#     products = Product.objects.all()  # Retrieve all products
#     return render(request, 'products/product_list.html', {'products': products})

# def product_detail(request, product_id):
#     product = get_object_or_404(Product, id=product_id)  # Fetch the product by ID
#     return render(request, 'products/product_detail.html', {'product': product})


# Add to cart view
# def add_to_cart(request, product_id):
#     product = get_object_or_404(Product, id=product_id)

#     # Assuming you have a Cart model and a method to add products to it
#     cart, created = Cart.objects.get_or_create(user=request.user, active=True)  # Fetch or create a cart for the user
#     cart.products.add(product)  # Add the product to the cart
#     cart.save()

#     messages.success(request, f"{product.name} added to your cart!")
#     return redirect('product_list')  # Redirect to the product list page after adding

# # Remove from cart view
# def remove_from_cart(request, product_id):
#     product = get_object_or_404(Product, id=product_id)

#     # Fetch the cart and remove the product
#     cart = Cart.objects.get(user=request.user, active=True)
#     cart.products.remove(product)
#     cart.save()

#     messages.success(request, f"{product.name} removed from your cart.")
#     return redirect('cart_view')  # Redirect to the cart view page

# Order detail view
# def order_detail(request, order_id):
#     order = get_object_or_404(Order, id=order_id, user=request.user)  # Get the order by ID and ensure it belongs to the user

#     return render(request, 'order_detail.html', {'order': order})  # Render the order detail template

# # Tracking details view
# def tracking_details(request, order_id):
#     order = get_object_or_404(Order, id=order_id, user=request.user)

#     # Assuming the order model has tracking details
#     tracking_info = order.tracking_info  # Assuming `tracking_info` is a field in the `Order` model

#     return render(request, 'tracking_details.html', {'order': order, 'tracking_info': tracking_info})
