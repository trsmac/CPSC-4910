# trackalytics/urls.py

from django.contrib import admin
from django.urls import path, include  # include is used for including app-level URLs

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app1.urls')),  # Include URLs from app1
]
