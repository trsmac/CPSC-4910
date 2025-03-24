# app1/decorators.py
from functools import wraps
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.contrib import messages

def role_required(roles=None, permissions=None):
    """
    Decorator to check user roles or permissions

    :param roles: List of role names required
    :param permissions: List of permission codenames required
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # Check if user is authenticated
            if not request.user.is_authenticated:
                messages.error(request, "You must be logged in to access this page.")
                return redirect('login')

            # Superusers have all access
            if request.user.is_superuser:
                return view_func(request, *args, **kwargs)

            # Get user's roles and permissions
            user_profile = request.user.profile
            user_roles = user_profile.roles.all()

            # Check roles if specified
            if roles:
                if not any(role.name in roles for role in user_roles):
                    messages.error(request, "Insufficient role access.")
                    return redirect('access_denied')

            # Check permissions if specified
            if permissions:
                user_permissions = Permission.objects.filter(
                    roles__user_profiles=user_profile
                ).values_list('codename', flat=True)

                if not all(perm in user_permissions for perm in permissions):
                    messages.error(request, "Insufficient permissions.")
                    return redirect('access_denied')

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator

def permission_required(permission_codename):
    """
    Decorator to check specific permission
    """
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            # Check if user is authenticated
            if not request.user.is_authenticated:
                messages.error(request, "You must be logged in to access this page.")
                return redirect('login')

            # Superusers have all access
            if request.user.is_superuser:
                return view_func(request, *args, **kwargs)

            # Get user's permissions
            user_profile = request.user.profile
            user_permissions = Permission.objects.filter(
                roles__user_profiles=user_profile
            ).values_list('codename', flat=True)

            # Check permission
            if permission_codename not in user_permissions:
                messages.error(request, "You do not have permission to access this resource.")
                return redirect('access_denied')

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator