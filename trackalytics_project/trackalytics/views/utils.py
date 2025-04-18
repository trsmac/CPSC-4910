from django.utils.dateformat import format
from ..models import InventoryItem

def get_client_ip(request):
    return request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR'))


def get_filtered_inventory(request):
    items = InventoryItem.objects.all()
    category = request.GET.get("category")
    min_qty = request.GET.get("min_quantity")

    if category:
        items = items.filter(category_type=category)
    if min_qty:
        items = items.filter(quantity__gte=int(min_qty))

    return items


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
