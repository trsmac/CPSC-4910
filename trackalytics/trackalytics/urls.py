# trackalytics/urls.py
from django.contrib import admin
from django.urls import path, include
from app1.views import CustomLoginView  # Import the custom view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/login/', CustomLoginView.as_view(), name='login'),  # Override default login
    path('accounts/', include('django.contrib.auth.urls')),  # Keep other auth URLs
    path('', include('app1.urls')),
]