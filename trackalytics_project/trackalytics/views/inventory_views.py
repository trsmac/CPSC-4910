from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required, permission_required

from ..models import InventoryItem, ActivityLog
from ..forms import InventoryForm
from .utils import get_client_ip, serialize_inventory_item


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
            return JsonResponse({'success': True, 'item': serialize_inventory_item(item, request)})
        return JsonResponse({'success': False, 'errors': form.errors})

    categories = InventoryItem.objects.values_list('category_type', flat=True).distinct()
    return render(request, 'inventory.html', {
        'form': InventoryForm(),
        'items': InventoryItem.objects.all().order_by('item_name'),
        'categories': categories,
    })


@csrf_exempt
@require_POST
@login_required
@permission_required('trackalytics.can_edit_inventory', raise_exception=True)
def update_inventory(request, item_id):
    item = get_object_or_404(InventoryItem, id=item_id)
    try:
        quantity = int(request.POST.get("quantity"))
        item.quantity = quantity
        item.save()
        ActivityLog.objects.create(
            user=request.user,
            action=f"Updated quantity of {item.item_name} to {quantity}",
            ip_address=get_client_ip(request),
        )
        return JsonResponse({'success': True, 'item': serialize_inventory_item(item, request)})
    except Exception as e:
        return JsonResponse({'success': False, 'errors': str(e)}, status=400)


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
        return JsonResponse({'success': True, 'message': f"{item_name} deleted."})
    except InventoryItem.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Item not found.'}, status=404)
