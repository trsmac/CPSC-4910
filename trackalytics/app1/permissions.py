# app1/permissions.py
from django.shortcuts import redirect
from django.contrib import messages
from django.http import HttpResponseForbidden
from functools import wraps
from .models import UserRole, Permission

def has_permission(user, permission_codename):
    """
    Check if a user has a specific permission through their assigned roles
    """
    if user.is_superuser:
        return True
        
    # Get all roles assigned to the user
    user_roles = UserRole.objects.filter(user=user).select_related('role')
    
    # Check if any of the user's roles have the required permission
    for user_role in user_roles:
        if user_role.role.permissions.filter(codename=permission_codename).exists():
            return True
            
    return False

def permission_required(permission_codename):
    """
    Decorator for views that checks if the user has the specified permission,
    redirecting to the login page if necessary or showing a forbidden page.
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # Check if user is authenticated
            if not request.user.is_authenticated:
                messages.error(request, "You must be logged in to access this page.")
                return redirect('login')
                
            # Check if user has the required permission
            if has_permission(request.user, permission_codename):
                return view_func(request, *args, **kwargs)
            
            # If user doesn't have permission
            messages.error(request, "You don't have permission to access this page.")
            return HttpResponseForbidden("Permission Denied: You don't have access to this resource.")
            
        return _wrapped_view
    return decorator

def has_role(user, role_name):
    """
    Check if a user has a specific role
    """
    if user.is_superuser:
        return True
        
    return UserRole.objects.filter(user=user, role__name=role_name).exists()

def role_required(role_name):
    """
    Decorator for views that checks if the user has the specified role
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # Check if user is authenticated
            if not request.user.is_authenticated:
                messages.error(request, "You must be logged in to access this page.")
                return redirect('login')
                
            # Check if user has the required role
            if has_role(request.user, role_name):
                return view_func(request, *args, **kwargs)
            
            # If user doesn't have the required role
            messages.error(request, "You don't have access to this page.")
            return HttpResponseForbidden("Access Denied: Your role doesn't have access to this resource.")
            
        return _wrapped_view
    return decorator