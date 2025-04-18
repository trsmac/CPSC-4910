from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required
from django.http import JsonResponse
from django.contrib import messages
from django.db.models import Count
from django.forms.models import model_to_dict
from django.contrib.auth.models import Group, Permission
from django.utils.dateformat import format
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import CustomUser, InventoryItem, Reservation, ActivityLog
from .forms import SignUpForm, InventoryForm, ReservationForm

import json


# ─────────────────────────────────────────────
#              Utility Functions
# ─────────────────────────────────────────────

def get_client_ip(request):
    return request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))


# ─────────────────────────────────────────────
#              Public and Auth Views
# ─────────────────────────────────────────────

def portal_redirect(request):
    if request.user.is_authenticated:
        return redirect('trackalytics:main_dashboard')
    return redirect('trackalytics:login')


@login_required
def main_dashboard(request):
    context = {
        'total_inventory': InventoryItem.objects.aggregate(total=Count('id'))['total'] or 0,
        'low_stock_items': InventoryItem.objects.filter(quantity__lte=5).count(),
        'zero_stock_items': InventoryItem.objects.filter(quantity=0).count(),
    }
    return render(request, 'main-dashboard.html', context)


@login_required
def kpi_dashboard(request):
    context = {
        'total_reservations': Reservation.objects.count(),
        'active_users': CustomUser.objects.filter(is_active=True).count(),
        'turnover_rate': InventoryItem.objects.aggregate(total=Count('id'))['total'] or 0,
    }
    return render(request, 'kpi-dashboard.html', context)


# ─────────────────────────────────────────────
#              Inventory Views
# ─────────────────────────────────────────────

@login_required
@permission_required('trackalytics.can_add_inventory', raise_exception=True)
def inventory(request):
    if request.method == 'POST':
        form = InventoryForm(request.POST)
        if form.is_valid():
            item = form.save()
            ActivityLog.objects.create(
                user=request.user,
                action=f"Added inventory item: {item.item_name}",
                ip_address=get_client_ip(request),
            )
            async_to_sync(get_channel_layer().group_send)(
                'inventory_updates',
                {
                    'type': 'send_inventory_update',
                    'content': {'action': 'add', 'item': serialize_inventory_item(item, request)},
                },
            )
            return JsonResponse({'success': True, 'item': serialize_inventory_item(item, request)})

        return JsonResponse({'success': False, 'errors': form.errors})

    return render(request, 'inventory.html', {
        'form': InventoryForm(),
        'items': InventoryItem.objects.all().order_by('item_name')
    })


@csrf_exempt
@require_POST
@login_required
@permission_required('trackalytics.can_edit_inventory', raise_exception=True)
def update_inventory(request, item_id):
    item = get_object_or_404(InventoryItem, id=item_id)
    form = InventoryForm(request.POST, instance=item)
    if form.is_valid():
        updated_item = form.save()
        ActivityLog.objects.create(
            user=request.user,
            action=f"Updated inventory item: {updated_item.item_name}",
            ip_address=get_client_ip(request),
        )
        async_to_sync(get_channel_layer().group_send)(
            'inventory_updates',
            {
                'type': 'send_inventory_update',
                'content': {'action': 'update', 'item': serialize_inventory_item(updated_item, request)},
            }
        )
        return JsonResponse({'success': True, 'item': serialize_inventory_item(updated_item, request)})

    return JsonResponse({'success': False, 'errors': form.errors}, status=400)


@csrf_exempt
@require_POST
@login_required
@permission_required('trackalytics.can_delete_inventory', raise_exception=True)
def delete_inventory(request, item_id):
    try:
        item = InventoryItem.objects.get(id=item_id)
        item_name = item.item_name
        item.delete()
        ActivityLog.objects.create(
            user=request.user,
            action=f"Deleted inventory item: {item_name}",
            ip_address=get_client_ip(request),
        )
        async_to_sync(get_channel_layer().group_send)(
            'inventory_updates',
            {
                'type': 'send_inventory_update',
                'content': {
                    'action': 'delete',
                    'item_id': item_id,
                    'item_name': item_name,
                    'user': request.user.get_full_name() or request.user.email,
                },
            }
        )
        return JsonResponse({'success': True, 'message': f"{item_name} deleted."})
    except InventoryItem.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Item not found.'}, status=404)


def serialize_inventory_item(item, request):
    return {
        'id': item.id,
        'item_code': item.item_code,
        'item_name': item.item_name,
        'barcode': item.barcode,
        'category_type': item.category_type,
        'quantity': item.quantity,
        'vendor_price': str(item.vendor_price) if item.vendor_price else None,
        'retail_price': str(item.retail_price) if item.retail_price else None,
        'notes': item.notes,
        'created_at': format(item.created_at, 'YmdHis'),
        'created_at_display': item.created_at.strftime('%b %d, %Y %I:%M %p'),
        'user': request.user.get_full_name() or request.user.email,
    }


# ─────────────────────────────────────────────
#              Reservation Views
# ─────────────────────────────────────────────

@login_required
def reservation(request):
    if request.method == 'POST':
        form = ReservationForm(request.POST)
        if form.is_valid():
            campsite = form.cleaned_data['campsite']
            if Reservation.objects.filter(campsite=campsite).exists():
                return JsonResponse({'success': False, 'error': f"Campsite {campsite} is already reserved."})
            reservation = form.save()
            ActivityLog.objects.create(
                user=request.user,
                action=f"Created reservation for {reservation.name}",
                ip_address=get_client_ip(request)
            )
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'errors': form.errors})
    return render(request, 'reservation.html', {'reservations': Reservation.objects.all()})


@login_required
def update_reservations(request):
    if request.method == 'POST':
        updates = json.loads(request.body)
        for update in updates:
            reservation = get_object_or_404(Reservation, id=update['id'])
            reservation.status = update['status']
            reservation.save()
            ActivityLog.objects.create(
                user=request.user,
                action=f"Updated reservation {reservation.id} status to {reservation.status}",
                ip_address=get_client_ip(request)
            )
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'})


# ─────────────────────────────────────────────
#              Role & Permission Views
# ─────────────────────────────────────────────

@login_required
def roles(request):
    if not request.user.has_perm('auth.change_group'):
        return render(request, 'access_denied.html')

    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        role_id = request.POST.get('role_id')
        user = get_object_or_404(CustomUser, id=user_id)
        role = get_object_or_404(Group, id=role_id)
        user.groups.clear()
        user.groups.add(role)
        ActivityLog.objects.create(
            user=request.user,
            action=f"Assigned role {role.name} to {user.email}",
            ip_address=get_client_ip(request)
        )
        return JsonResponse({'success': True})

    roles = Group.objects.all()
    permissions = Permission.objects.filter(content_type__app_label='trackalytics')
    users = CustomUser.objects.all()
    return render(request, 'roles.html', {'roles': roles, 'permissions': permissions, 'users': users})


@login_required
def update_permissions(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        role_name = data.get('role')
        permissions = data.get('permissions', [])

        role = get_object_or_404(Group, name=role_name.capitalize())
        role.permissions.clear()
        for perm_code in permissions:
            permission = get_object_or_404(Permission, codename=perm_code)
            role.permissions.add(permission)

        ActivityLog.objects.create(
            user=request.user,
            action=f"Updated permissions for role {role.name}",
            ip_address=get_client_ip(request)
        )
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'})


# ─────────────────────────────────────────────
#              Logs, Settings, Reports
# ─────────────────────────────────────────────

@login_required
def activity_log(request):
    logs = ActivityLog.objects.all()
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        if user_id:
            logs = logs.filter(user_id=user_id)
    return render(request, 'activitylog.html', {'logs': logs, 'users': CustomUser.objects.all()})


@login_required
def settings(request):
    return render(request, 'settings.html')


@login_required
def reports(request):
    return render(request, 'reports.html')


# ─────────────────────────────────────────────
#              Authentication Views
# ─────────────────────────────────────────────

def login_view(request):
    if request.user.is_authenticated:
        return redirect('trackalytics:main_dashboard')

    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, email=email, password=password)
        if user:
            login(request, user)
            ActivityLog.objects.create(user=user, action="Logged in", ip_address=get_client_ip(request))
            return redirect('trackalytics:main_dashboard')
        messages.error(request, 'Invalid email or password.')
    return render(request, 'login.html')


def signup_view(request):
    if request.user.is_authenticated:
        return redirect('trackalytics:main_dashboard')

    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            ActivityLog.objects.create(user=user, action="Signed up", ip_address=get_client_ip(request))
            return redirect('trackalytics:main_dashboard')
        messages.error(request, 'Please correct the errors below.')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})


@login_required
def logout_view(request):
    ActivityLog.objects.create(user=request.user, action="Logged out", ip_address=get_client_ip(request))
    logout(request)
    return redirect('trackalytics:login')


def access_denied(request):
    return render(request, 'access_denied.html')
