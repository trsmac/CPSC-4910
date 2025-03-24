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
]