# app1/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('inventory/', views.inventory, name='inventory'),

    path('add_inventory/', views.add_inventory, name='add_inventory'),
    path('remove_inventory/<int:inventory_id>/', views.remove_inventory, name='remove_inventory'),
    path('view_inventory/<int:inventory_id>/', views.view_inventory, name='view_inventory'),

    path('roles/', views.roles, name='roles'),

    path('activitylog/', views.activitylog, name='activitylog'),
    path('product_list/', views.product_list, name='product_list'),
    path('inventory_history/<int:product_id>/', views.inventory_history, name='inventory_history'),
    path('search/', views.search_inventory, name='search_inventory'),
    path('traceability_report/<int:product_id>/', views.traceability_report, name='traceability_report'),
    path('export_traceability_report/<int:product_id>/csv/', views.export_traceability_report_csv, name='export_traceability_report_csv'),
    path('export_traceability_report/<int:product_id>/pdf/', views.export_traceability_report_pdf, name='export_traceability_report_pdf'),
    # Role Management URLs
    path('roles/manage/', views.manage_roles, name='manage_roles'),
    path('roles/create/', views.edit_role, name='create_role'),
    path('roles/edit/<int:role_id>/', views.edit_role, name='edit_role'),
    path('roles/delete/<int:role_id>/', views.delete_role, name='delete_role'),
    path('roles/details/<int:role_id>/', views.get_role_details, name='role_details'),

    # User Role Management URLs
    path('users/assign-role/', views.assign_role, name='assign_role'),
    path('users/remove-role/', views.remove_role, name='remove_role'),
    path('users/permissions/', views.get_user_permissions, name='get_user_permissions'),
    path('roles/assign/<int:user_id>/', views.assign_user_role, name='assign_user_role'),

    # Access Control URLs
    path('access-denied/', views.access_denied, name='access_denied'),
]