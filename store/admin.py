from django.utils.html import format_html
from django.contrib import admin
from .models import Category, Product, Customer, Cart, CartItem, Order, OrderItem, Review, Payment


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(OrderItem)
admin.site.register(Review)



class PaymentInline(admin.StackedInline):
    """
    Inline admin to manage Payment details directly within the Order admin interface.
    """
    model = Payment  # Reference the Payment model
    extra = 1  # Number of empty forms to display for adding new payments
    fields = ('payment_method', 'payment_number', 'payment_date', 'amount')  # Fields to display in the inline
    readonly_fields = ('payment_date',)  # Optional: Make payment date read-only to prevent manual changes

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'total_amount', 'status', 'formatted_payment_method')
    list_filter = ('status', 'payment__payment_method')
    search_fields = ('id', 'customer__user__username', 'status')
    list_editable = ('status',)
    inlines = [PaymentInline]

    def formatted_payment_method(self, obj):
        """
        Retrieve and format the payment method for better display in the admin.
        """
        if hasattr(obj, 'payment') and obj.payment:  # Check if the Order has an associated Payment
            return obj.payment.get_payment_method_display()  # Fetch the display name from the Payment choices
        return "No Payment"  # Fallback if no Payment is associated
    formatted_payment_method.short_description = 'Payment Type'

    
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username', 'user__email')