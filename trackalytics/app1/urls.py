# trackalytics/app1/urls.py

from django.urls import path
from . import views

app_name = 'app1'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('inventory/', views.inventory, name='inventory'),
    path('inventory/stream/', views.inventory_stream, name='inventory_stream'),
    path('products/', views.product_list, name='product_list'),
    path('products/create/', views.product_create, name='product_create'),
    path('history/', views.inventory_history, name='inventory_history'),
    path('reports/', views.reports_exports, name='reports_exports'),
    path('report/generate/', views.generate_inventory_report, name='generate_inventory_report'),
    path('export/', views.export_data, name='export_data'),
    path('activity/', views.activity_log, name='activity_log'),
    path('register/', views.register, name='register'),
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('notifications/mark-read/<int:notification_id>/', views.mark_notification_read, name='mark_notification_read'),
    path('notifications/mark-all-read/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
]