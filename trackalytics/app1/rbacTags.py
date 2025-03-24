# app1/templatetags/rbac_tags.py
from django import template
from django.template.library import Library

register = Library()

@register.simple_tag(takes_context=True)
def has_role(context, role_name):
    """
    Check if current user has a specific role
    """
    request = context['request']
    return (
        request.user.is_superuser or
        (hasattr(request, 'user_roles') and role_name in request.user_roles)
    )

@register.simple_tag(takes_context=True)
def has_permission(context, permission_codename):
    """
    Check if current user has a specific permission
    """
    request = context['request']
    return (
        request.user.is_superuser or
        (hasattr(request, 'user_permissions') and permission_codename in request.user_permissions)
    )

@register.inclusion_tag('rbac/conditional_element.html', takes_context=True)
def role_conditional_element(context, roles=None, permissions=None):
    """
    Conditionally render an element based on roles or permissions
    """
    request = context['request']
    user = request.user

    # Superusers see everything
    if user.is_superuser:
        return {'show_element': True}

    # Check roles
    if roles:
        role_match = any(
            role in request.user_roles
            for role in (roles if isinstance(roles, list) else [roles])
        )
        if not role_match:
            return {'show_element': False}

    # Check permissions
    if permissions:
        perm_match = all(
            perm in request.user_permissions
            for perm in (permissions if isinstance(permissions, list) else [permissions])
        )
        if not perm_match:
            return {'show_element': False}

    return {'show_element': True}