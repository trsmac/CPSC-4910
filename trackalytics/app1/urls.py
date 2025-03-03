# app1/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Root of the app, maps to the index view
    path('dashboard/', views.dashboard, name='dashboard'),  # Change from dashboard.html to dashboard
    path('inventory/', views.inventory, name='inventory'),  # Change from inventory.html to inventory
    path('add_inventory/', views.add_inventory, name='add_inventory'),  # Path for adding inventory
    path('remove_inventory/<int:inventory_id>/', views.remove_inventory, name='remove_inventory'),  # Path for removing inventory (with ID)
    path('view_inventory/<int:inventory_id>/', views.view_inventory, name='view_inventory'),  # Path for viewing inventory (with ID)
    path('roles/', views.roles, name='roles'),  # Change from roles.html to roles
    path('activitylog/', views.activitylog, name='activitylog'),  # Change from activitylog.html to activitylog
    path('product_list/', views.product_list, name='product_list'),  # Change from product_list.html to product_list
    path('inventory_history/', views.inventory_history, name='inventory_history'),  # Change from inventory_history.html to inventory_history
    path('search/', views.search_inventory, name='search_inventory'),
]