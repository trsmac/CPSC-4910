# app1/views.py
from django.shortcuts import get_object_or_404, redirect, render
from .models import ActivityLog, Product, Inventory, InventoryHistory
from django.db.models import Q
from django.http import HttpResponse
from io import BytesIO
from io import StringIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime
import csv

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
def inventory_history(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    inventory_history = InventoryHistory.objects.filter(inventory__product=product).order_by('transaction_date')
    
    return render(request, 'inventory_history.html', {
        'product': product,
        'inventory_history': inventory_history
    })

# Add Inventory view
def add_inventory(request):
    if request.method == 'POST':
        # Get data from POST request
        product_name = request.POST.get('product_name')
        quantity = request.POST.get('quantity')

        # Create new inventory item
        inventory_item = Inventory.objects.create(product_name=product_name, quantity=quantity)

        # Log the action using the helper function
        log_user_action(request.user, f"Added new inventory item: {product_name} (Quantity: {quantity})")

        # Redirect to the inventory page after adding
        return redirect('inventory')

    # Render the add inventory form for GET requests
    return render(request, 'add_inventory.html')

# Remove Inventory view
def remove_inventory(request, inventory_id):
    try:
        
        inventory_item = Inventory.objects.get(id=inventory_id)
        inventory_item.delete()
        
        ActivityLog.objects.create(
            user=request.user,
            action=f'Removed inventory: {inventory_item.product_name}'
        )

        return redirect('inventory')

    except Inventory.DoesNotExist:

        return render(request, 'inventory.html', {'error': 'Inventory item not found.'})

# View Inventory details
def view_inventory(request, inventory_id):
    inventory_item = get_object_or_404(Inventory, id=inventory_id)
    return render(request, 'view_inventory.html', {'inventory_item': inventory_item})

# Add this search functionality
def search_inventory(request):
    query = request.GET.get('q', '')  # Get the search term from the query string
    results = []

    if query:
        results = Inventory.objects.filter(
            Q(serial_number__icontains=query) | Q(batch_number__icontains=query)
        ).distinct()  # Search for matching serial_number or batch_number

    return render(request, 'search_inventory.html', {'results': results, 'query': query})

# Traceability Report view
def traceability_report(request, product_id):
    # Get the product from the database
    product = get_object_or_404(Product, id=product_id)
    
    # Fetch the inventory history for this product, ordered by transaction date
    inventory_history = InventoryHistory.objects.filter(inventory__product=product).order_by('transaction_date')

    return render(request, 'traceability_report.html', {
        'product': product,
        'inventory_history': inventory_history
    })

# CSV Export Functionality
def export_traceability_report_csv(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    inventory_history = InventoryHistory.objects.filter(inventory__product=product).order_by('transaction_date')
    
    # Create a CSV in-memory buffer
    output = StringIO()
    writer = csv.writer(output)
    
    # Write headers to CSV
    writer.writerow(['Action', 'Quantity', 'Transaction Date', 'Product Name'])
    
    # Write inventory history records
    for history in inventory_history:
        writer.writerow([history.action, history.quantity, history.transaction_date, product.product_name])

    # Create the HTTP response with the CSV content
    response = HttpResponse(output.getvalue(), content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{product.product_name}_traceability_report.csv"'
    
    return response

from io import BytesIO
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# PDF Export Functionality
def export_traceability_report_pdf(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    inventory_history = InventoryHistory.objects.filter(inventory__product=product).order_by('transaction_date')
    
    # Create a PDF in memory
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Write the content to the PDF
    p.drawString(100, 750, f"Traceability Report for Product: {product.product_name}")
    p.drawString(100, 730, f"Product ID: {product.id}")
    
    # Define a position for the table rows
    y_position = 700
    for history in inventory_history:
        p.drawString(100, y_position, f"Action: {history.action}")
        p.drawString(250, y_position, f"Quantity: {history.quantity}")
        p.drawString(400, y_position, f"Date: {history.transaction_date}")
        y_position -= 20  # Move down the page for the next row
    
    # Finalize the PDF
    p.showPage()
    p.save()

    # Send the PDF as response
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{product.product_name}_traceability_report.pdf"'

    return response

# Helper function to log user actions
def log_user_action(user, action):
    ActivityLog.objects.create(
        user=user,
        action=action,
        timestamp=datetime.now()  # The timestamp will automatically be set
    )
