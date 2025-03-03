# app1/views.py

from django.shortcuts import get_object_or_404, redirect, render
from .models import ActivityLog, Product, Inventory, InventoryHistory

# Root index view
def index(request):
    return render(request, 'index.html')

# Dashboard view
def dashboard(request):
    return render(request, 'dashboard.html')

# Inventory view
def inventory(request):
    inventory_items = Inventory.objects.all()
    return render(request, 'inventory.html', {'inventory_items': inventory_items})

# Roles view
def roles(request):
    return render(request, 'roles.html')

# Activity Log view
def activitylog(request):
    logs = ActivityLog.objects.all()
    return render(request, 'activitylog.html', {'logs': logs})

# Product List view
def product_list(request):
    products = Product.objects.all()
    return render(request, 'product_list.html', {'products': products})

# Inventory History view
def inventory_history(request):
    history = InventoryHistory.objects.all()
    return render(request, 'inventory_history.html', {'history': history})

# Add Inventory view
def add_inventory(request):
    if request.method == 'POST':
        # Get data from POST request
        product_name = request.POST.get('product_name')
        quantity = request.POST.get('quantity')

        # Create a new inventory item
        Inventory.objects.create(product_name=product_name, quantity=quantity)

        # Redirect to the inventory page after adding
        return redirect('inventory')

    # Render the add inventory form for GET requests
    return render(request, 'add_inventory.html')

# Remove Inventory view
def remove_inventory(request, inventory_id):
    try:
        # Find the inventory item by its ID and delete it
        inventory_item = Inventory.objects.get(id=inventory_id)
        inventory_item.delete()

        # Redirect to the inventory page after removal
        return redirect('inventory')
    except Inventory.DoesNotExist:
        # If the item does not exist, render the inventory page with an error message
        return render(request, 'inventory.html', {'error': 'Inventory item not found.'})

# View Inventory details
def view_inventory(request, inventory_id):
    # Fetch the inventory item or return a 404 if not found
    inventory_item = get_object_or_404(Inventory, id=inventory_id)
    return render(request, 'view_inventory.html', {'inventory_item': inventory_item})
