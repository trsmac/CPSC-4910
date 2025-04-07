# app1/middleware.py
from .models import UserRole

class RoleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Process request before view
        if request.user.is_authenticated:
            # Get all permissions for the user
            permissions = []

            if request.user.is_superuser:
                # Superuser has all permissions
                request.user_permissions = ['all']
                request.user_roles = ['Admin']
            else:
                # Get roles and permissions
                roles = []

                for user_role in UserRole.objects.filter(user=request.user).select_related('role'):
                    roles.append(user_role.role.name)
                    for permission in user_role.role.permissions.all():
                        if permission.codename not in permissions:
                            permissions.append(permission.codename)

                request.user_permissions = permissions
                request.user_roles = roles

        response = self.get_response(request)
        return response