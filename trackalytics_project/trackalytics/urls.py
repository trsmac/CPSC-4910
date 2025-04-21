from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'trackalytics'

urlpatterns = [
    # Portal and Dashboard
    path('', views.portal_redirect, name='portal'),
    path('dashboard/', views.dashboard, name='dashboard'),

    # Inventory Management
    path('inventory/', views.inventory, name='inventory'),
    path('inventory/update/<int:item_id>/', views.update_inventory, name='update_inventory'),
    path('inventory/delete/<int:item_id>/', views.delete_inventory, name='delete_inventory'),

    # Reservations
    path('reservation/', views.reservation, name='reservation'),
    path('update-reservations/', views.update_reservations, name='update_reservations'),

    # Roles and Permissions
    path('roles/', views.roles, name='roles'),
    path('update-permissions/', views.update_permissions, name='update_permissions'),

    # Activity Logs
    path('activitylog/', views.activity_log, name='activity_log'),

    # Authentication
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('access-denied/', views.access_denied, name='access_denied'),
]
    