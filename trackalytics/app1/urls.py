# app1/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Root of the app, maps to the index view
    path('dashboard.html', views.dashboard, name='dashboard'),  # Change from dashboard.html to dashboard
    path('inventory.html', views.inventory, name='inventory'),  # Change from inventory.html to inventory
    path('add_inventory.html/', views.add_inventory, name='add_inventory'),  # Path for adding inventory
    path('remove_inventory.html', views.remove_inventory, name='remove_inventory'),  # Path for removing inventory
    path('view_inventory.html', views.view_inventory, name='view_inventory'),  # Path for viewing inventory
    path('roles.html', views.roles, name='roles'),  # Change from roles.html to roles
    path('activitylog.html', views.activitylog, name='activitylog'),  # Change from activitylog.html to activitylog
    path('product_list.html', views.product_list, name='product_list'),  # Change from product_list.html to product_list
    path('inventory_history.html/', views.inventory_history, name='inventory_history'),  # Change from inventory_history.html to inventory_history
    
]