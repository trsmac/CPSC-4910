from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'trackalytics'

urlpatterns = [
    path('', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('dashboard/', views.main_dashboard, name='main_dashboard'),
    path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('kpi/', views.kpi_dashboard, name='kpi_dashboard'),
    path('inventory/', views.inventory, name='inventory'),
    path('inventory/update/<int:item_id>/', views.update_inventory, name='update_inventory'),
    path('inventory/delete/<int:item_id>/', views.delete_inventory, name='delete_inventory'),
    path('reservation/', views.reservation, name='reservation'),
    path('reservations/update_status/', views.update_reservations, name='update_reservation_status'),
    path('roles/', views.roles, name='roles'),
    path('roles/update_permissions/', views.update_permissions, name='update_permissions'),
    path('activity/', views.activity_log, name='activity_log'),
    path('reports/', views.reports, name='reports'),
    path('logout/', views.logout_view, name='logout'),
    path('settings/', views.settings, name='settings'),

    # Export endpoints
    path('export/csv/', views.export_inventory_csv, name='export_inventory_csv'),
    path('export/excel/', views.export_inventory_excel, name='export_inventory_excel'),
    path('export/json/', views.export_inventory_json, name='export_inventory_json'),
    path('export/pdf/', views.export_inventory_pdf, name='export_inventory_pdf'),
]
