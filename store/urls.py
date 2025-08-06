from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('about',views.about, name='about'),
    path('contact',views.contact,name='contact'),
    path('login',views.login,name='login'),
    path('signup',views.signup,name='signup'),
    path('userdashboard', views.userdashboard,name='userdashboard'),
    path('userDashboard/orders',views.orders,name='my_orders'),
    path('logout/', views.logout_view, name='logout'),
    path('userDashboard/reviews',views.review_dashboard , name='reviews'),    
    path('products/', views.products_view, name='product_list'),  # Updated path for listing all products
    path('products/<int:category_id>/', views.products_view, name='products'),
    # path('products/<int:product_id>/', views.product_detail, name='product_detail'), #single product
    path('categories/', views.categories, name='categories'),
    path('categories/<int:category_id>/', views.category_detail, name='category_detail'),
    path('cart/', views.cart_view, name='cart'),
    path('product_description/', views.product_description, name='product_description'),
    path('add_to_cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path('update-cart/<int:item_id>/', views.update_cart, name='update_cart'),
    path('cart/remove/<int:item_id>/', views.remove_from_cart, name='remove_from_cart'),   
    path('checkout/', views.checkout, name='checkout'),
    path('order-success/<int:order_id>/', views.order_success, name='order_success'),
    path('order-success/<int:order_id>/download-receipt/', views.download_receipt, name='download_receipt'),
    path('order/<int:order_id>/details/', views.order_details, name='order_details'),
    path('order/<int:order_id>/', views.order_details, name='order_detail'),
    path("product_description/<int:product_id>/", views.product_description, name="product_description"),
    path("product_description/<int:product_id>/submit_review/", views.submit_review, name="submit_review"),
    path('base_withsearch/', views.search, name='search'),
    path('search/', views.search_products, name='search_products'),
    
]

# # href="{% url 'product:detail' item.product.slug %}
# # <button type="submit"><a class="update update-btn"
# href="{% url 'update_cart' item.id %}">Update Cart</a></button>
# # "