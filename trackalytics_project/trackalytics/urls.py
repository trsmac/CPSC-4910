from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'trackalytics'

urlpatterns = [
    path('', views.portal_redirect, name='portal'),
    path('dashboard/', views.main_dashboard, name='main_dashboard'),
    path('kpi-dashboard/', views.kpi_dashboard, name='kpi_dashboard'),
    path('inventory/', views.inventory, name='inventory'),
    path('inventory/update/<int:item_id>/', views.update_inventory, name='update_inventory'),
    path('reservation/', views.reservation, name='reservation'),
    path('roles/', views.roles, name='roles'),
    path('activitylog/', views.activity_log, name='activity_log'),
    path('settings/', views.settings, name='settings'),
    path('reports/', views.reports, name='reports'),

    # Auth
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup_view, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('access-denied/', views.access_denied, name='access_denied'),

    # AJAX endpoints
    path('update-reservations/', views.update_reservations, name='update_reservations'),
    path('update-permissions/', views.update_permissions, name='update_permissions'),

    # Password reset flow
    path('password_reset/', auth_views.PasswordResetView.as_view(
        template_name='password_reset_form.html',
        email_template_name='password_reset_email.html',
        subject_template_name='password_reset_subject.txt'
    ), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='password_reset_done.html'
    ), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='password_reset_confirm.html'
    ), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(
        template_name='password_reset_complete.html'
    ), name='password_reset_complete'),
]
