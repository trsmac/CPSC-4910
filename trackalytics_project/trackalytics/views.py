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
        return redirect('trackalytics:dashboard')
    return redirect('trackalytics:login')

# ─────────────────────────────────────────────
#              Dashboard Views
# ─────────────────────────────────────────────

@login_required
def dashboard(request):
    total_inventory = InventoryItem.objects.count()
    low_stock_items = InventoryItem.objects.filter(quantity__lte=5).count()
    zero_stock_items = InventoryItem.objects.filter(quantity=0).count()
    total_reservations = Reservation.objects.count()
    active_users = CustomUser.objects.filter(is_active=True).count()
    turnover_rate = InventoryItem.objects.aggregate(total=Count('id'))['total'] or 0

    context = {
        'cards': [
            {"label": "Total Inventory", "value": total_inventory, "icon": "inventory_2", "color": "text-blue"},
            {"label": "Low Stock Items", "value": low_stock_items, "icon": "e911_emergency", "color": "text-red"},
            {"label": "Zero Stock Items", "value": zero_stock_items, "icon": "block", "color": "text-yellow"},
            {"label": "Total Reservations", "value": total_reservations, "icon": "event", "color": "text-blue"},
            {"label": "Active Users", "value": active_users, "icon": "group", "color": "text-green"},
            {"label": "Inventory Turnover", "value": turnover_rate, "icon": "autorenew", "color": "text-yellow"},
        ],
        # Optional: include individual values too, if used elsewhere in the template
        'total_inventory': total_inventory,
        'low_stock_items': low_stock_items,
        'zero_stock_items': zero_stock_items,
        'total_reservations': total_reservations,
        'active_users': active_users,
        'turnover_rate': turnover_rate,
    }

    return render(request, 'dashboard.html', context)


# ─────────────────────────────────────────────
#              Inventory Views
# ─────────────────────────────────────────────

def inventory(request):
    if request.method == 'POST':
        form = InventoryForm(request.POST)
        if form.is_valid():
            form.save()
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': True})
            return redirect('trackalytics:inventory')
        else:
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'success': False, 'errors': form.errors}, status=400)
            return render(request, 'inventory.html', {'form': form, 'items': InventoryItem.objects.all()})
    else:
        form = InventoryForm()
        items = InventoryItem.objects.all()
        return render(request, 'inventory.html', {'form': form, 'items': items})


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
        item_id = request.POST.get('item_id')
        name = request.POST.get('customer_name')
        phone = request.POST.get('customer_phone')
        email = request.POST.get('customer_email')
        campsite = request.POST.get('campsite_number')
        quantity = request.POST.get('quantity')

        try:
            item = InventoryItem.objects.get(id=item_id)
            Reservation.objects.create(
                item=item,
                name=name,
                phone=phone,
                email=email,
                campsite=campsite,
                quantity=quantity,
                status='Pending'
            )
            messages.success(request, 'Reservation created successfully.')
        except InventoryItem.DoesNotExist:
            messages.error(request, 'Invalid item selected.')

    return render(request, 'reservation.html', {
        'reservations': Reservation.objects.all()
    })

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
@permission_required('auth.change_group', raise_exception=True)
def roles(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')
        role_name = data.get('role_id')

        try:
            user = CustomUser.objects.get(id=user_id)
            group = Group.objects.get(name=role_name)
            user.groups.clear()
            user.groups.add(group)
            return JsonResponse({'success': True})
        except (CustomUser.DoesNotExist, Group.DoesNotExist):
            return JsonResponse({'success': False, 'error': 'Invalid user or role.'}, status=400)

    roles = Group.objects.all()
    permissions = Permission.objects.filter(content_type__app_label='trackalytics')
    users = CustomUser.objects.all()
    return render(request, 'roles.html', {
        'roles': roles,
        'permissions': permissions,
        'users': users
    })

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
#              Logs and Export
# ─────────────────────────────────────────────

@login_required
def activity_log(request):
    logs = ActivityLog.objects.all()
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        if user_id:
            logs = logs.filter(user_id=user_id)

    return render(request, 'activitylog.html', {
        'logs': logs,
        'users': CustomUser.objects.all()
    })

@login_required
def export_inventory(request):
    import csv
    from django.http import HttpResponse

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="inventory_export.csv"'

    writer = csv.writer(response)
    writer.writerow(['Item Name', 'Category', 'Quantity', 'Vendor Price', 'Retail Price', 'Barcode'])

    for item in InventoryItem.objects.all():
        writer.writerow([
            item.item_name,
            item.get_category_type_display(),
            item.quantity,
            item.vendor_price,
            item.retail_price,
            item.barcode
        ])

    return response

# ─────────────────────────────────────────────
#              Authentication Views
# ─────────────────────────────────────────────

def login_view(request):
    if request.user.is_authenticated:
        return redirect('trackalytics:dashboard')

    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        user = authenticate(request, email=email, password=password)
        if user:
            login(request, user)
            return redirect('trackalytics:dashboard')
        messages.error(request, 'Invalid email or password.')

    return render(request, 'login.html')


def signup_view(request):
    if request.user.is_authenticated:
        return redirect('trackalytics:dashboard')  # Redirect authenticated users to the dashboard

    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)  # Automatically log in the user after sign-up
            return redirect('trackalytics:dashboard')  # Change this if you want a different redirect
        else:
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
