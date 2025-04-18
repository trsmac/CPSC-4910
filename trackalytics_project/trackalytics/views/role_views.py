from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group, Permission
from ..models import CustomUser, ActivityLog
from .utils import get_client_ip
import json

@login_required
def roles(request):
    if not request.user.has_perm('auth.change_group'):
        return render(request, 'access_denied.html')

    if request.method == 'POST':
        user = get_object_or_404(CustomUser, id=request.POST.get('user_id'))
        role = get_object_or_404(Group, id=request.POST.get('role_id'))
        user.groups.set([role])
        ActivityLog.objects.create(
            user=request.user,
            action=f"Assigned role {role.name} to {user.email}",
            ip_address=get_client_ip(request)
        )
        return JsonResponse({'success': True})

    return render(request, 'roles.html', {
        'roles': Group.objects.all(),
        'permissions': Permission.objects.filter(content_type__app_label='trackalytics'),
        'users': CustomUser.objects.all(),
    })


@login_required
def update_permissions(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        role = get_object_or_404(Group, name=data.get('role').capitalize())
        role.permissions.clear()
        for code in data.get('permissions', []):
            permission = get_object_or_404(Permission, codename=code)
            role.permissions.add(permission)
        ActivityLog.objects.create(
            user=request.user,
            action=f"Updated permissions for role {role.name}",
            ip_address=get_client_ip(request)
        )
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'})
