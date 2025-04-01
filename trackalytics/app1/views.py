"""
TRACKALYTICS VIEWS - trackalytics/app1/views.py
==================
This file contains all view functions for the Trackalytics inventory management system.
"""

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User, Group
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db.models import Sum, F
from django.template.loader import get_template
from xhtml2pdf import pisa
import csv
import json
import time
from .models import Product, Inventory, InventoryHistory, ReportExport, ActivityLog, InventoryNotification
from .forms import AddInventoryForm, RemoveInventoryForm, ExportForm, ProductForm, RegistrationForm


"""
DASHBOARD & STREAMING VIEWS
---------------------------
Views for the main dashboard and real-time inventory streaming
"""

def dashboard(request):
    """
    Main dashboard view showing inventory summary statistics.
    """
    total_inventory = Inventory.objects.count()
    low_stock_items = Inventory.objects.filter(quantity__lte=10).count()
    zero_stock_items = Inventory.objects.filter(quantity=0).count()
    
    low_stock_products = Product.objects.annotate(
        total_quantity=Sum('inventory__quantity')
    ).filter(total_quantity__lt=F('low_stock_threshold'))
    
    if request.user.is_authenticated:
        ActivityLog.objects.create(user=request.user, action='Viewed dashboard')
    
    return render(request, 'dashboard.html', {
        'total_inventory': total_inventory,
        'low_stock_items': low_stock_items,
        'zero_stock_items': zero_stock_items,
        'low_stock_products': low_stock_products,
    })

def inventory_stream(request):
    """
    Server-Sent Events (SSE) endpoint for real-time inventory updates.
    """
    def event_stream():
        last_checked = time.time()
        while True:
            if time.time() - last_checked > 5:
                last_checked = time.time()
                
                low_stock_products = Product.objects.annotate(
                    total_quantity=Sum('inventory__quantity')
                ).filter(
                    total_quantity__lt=F('low_stock_threshold')
                ).values('id', 'product_name', 'total_quantity', 'low_stock_threshold')
                
                notifications = []
                if request.user.is_authenticated:
                    notifications = InventoryNotification.objects.filter(
                        is_read=False,
                        recipients=request.user
                    ).order_by('-created_at')[:5].values('id', 'message')
                
                yield f"data: {json.dumps({
                    'low_stock': list(low_stock_products),
                    'notifications': list(notifications),
                    'timestamp': time.time()
                })}\n\n"
            
            time.sleep(1)
    
    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    return response

"""
INVENTORY MANAGEMENT VIEWS
--------------------------
Views for handling all inventory-related operations
"""

@require_http_methods(["GET", "POST"])
def inventory(request):
    """
    Combined view for all inventory operations (GET, POST, AJAX).
    """
    if request.method == 'GET':
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return _handle_inventory_ajax_get(request)
        return _handle_inventory_regular_get(request)
    
    elif request.method == 'POST':
        return _handle_inventory_post(request)

def _handle_inventory_ajax_get(request):
    """Handle AJAX GET requests for inventory data"""
    item_id = request.GET.get('id')
    if item_id:
        try:
            item = Inventory.objects.get(id=item_id)
            return JsonResponse({
                'success': True,
                'item': {
                    'id': item.id,
                    'quantity': item.quantity,
                    'location': item.location
                }
            })
        except Inventory.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Item not found'}, status=404)
    
    inventory_data = list(Inventory.objects.values(
        'id', 'product__product_name', 'batch_number', 
        'serial_number', 'quantity', 'location', 'last_updated'
    ))
    
    low_stock = list(Product.objects.annotate(
        total_quantity=Sum('inventory__quantity')
    ).filter(
        total_quantity__lt=F('low_stock_threshold')
    ).values('id', 'product_name', 'total_quantity', 'low_stock_threshold'))
    
    return JsonResponse({
        'success': True,
        'inventory': inventory_data,
        'low_stock': low_stock
    })

def _handle_inventory_regular_get(request):
    """Handle regular GET requests (full page load)"""
    add_form = AddInventoryForm()
    remove_form = RemoveInventoryForm()
    inventory_items = Inventory.objects.select_related('product').all()
    
    return render(request, 'inventory.html', {
        'add_form': add_form,
        'remove_form': remove_form,
        'inventory': inventory_items
    })

def _handle_inventory_post(request):
    """Handle all POST requests to inventory endpoint"""
    try:
        action = _get_inventory_action(request)
        
        if action == 'add':
            return _handle_add_inventory(request)
        elif action == 'remove':
            return _handle_remove_inventory(request)
        elif action == 'edit':
            return _handle_edit_inventory(request)
        elif action == 'delete':
            return _handle_delete_inventory(request)
        
        return JsonResponse({'success': False, 'error': 'Invalid action'}, status=400)
    
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

def _get_inventory_action(request):
    """Extract action from request (supports form POST and JSON)"""
    if request.POST.get('action'):
        return request.POST.get('action')
    if request.headers.get('X-Inventory-Action'):
        return request.headers.get('X-Inventory-Action')
    if request.body:
        try:
            return json.loads(request.body).get('action')
        except json.JSONDecodeError:
            pass
    return None

def _handle_add_inventory(request):
    """Process inventory addition"""
    form = AddInventoryForm(request.POST)
    if form.is_valid():
        item = form.save()
        InventoryHistory.objects.create(
            inventory=item,
            action='received',
            quantity=item.quantity
        )
        _check_low_stock(item.product)
        if request.user.is_authenticated:
            ActivityLog.objects.create(user=request.user, action='Added inventory')
        return _inventory_response('Item added successfully')
    return JsonResponse({'success': False, 'error': form.errors.as_json()}, status=400)

def _handle_remove_inventory(request):
    """Process inventory removal"""
    form = RemoveInventoryForm(request.POST)
    if form.is_valid():
        product = form.cleaned_data['product']
        quantity = form.cleaned_data['quantity']
        inventory_item = Inventory.objects.filter(product=product).first()
        
        if inventory_item:
            inventory_item.quantity = max(0, inventory_item.quantity - quantity)
            inventory_item.save()
            InventoryHistory.objects.create(
                inventory=inventory_item,
                action='sold',
                quantity=quantity
            )
            _check_low_stock(product)
            if request.user.is_authenticated:
                ActivityLog.objects.create(user=request.user, action='Removed inventory')
            return _inventory_response('Item removed successfully')
        return JsonResponse({'success': False, 'error': 'Inventory item not found'}, status=404)
    return JsonResponse({'success': False, 'error': form.errors.as_json()}, status=400)

def _handle_edit_inventory(request):
    """Process inventory edits"""
    data = json.loads(request.body) if request.body else request.POST
    try:
        item = Inventory.objects.get(id=data.get('id'))
        item.quantity = data.get('quantity', item.quantity)
        item.location = data.get('location', item.location)
        item.save()
        _check_low_stock(item.product)
        if request.user.is_authenticated:
            ActivityLog.objects.create(user=request.user, action='Updated inventory')
        return _inventory_response('Item updated successfully')
    except Inventory.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Item not found'}, status=404)

def _handle_delete_inventory(request):
    """Process inventory deletion"""
    data = json.loads(request.body) if request.body else request.POST
    try:
        item = Inventory.objects.get(id=data.get('id'))
        product = item.product
        item.delete()
        _check_low_stock(product)
        if request.user.is_authenticated:
            ActivityLog.objects.create(user=request.user, action='Deleted inventory')
        return _inventory_response('Item deleted successfully')
    except Inventory.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Item not found'}, status=404)

def _check_low_stock(product):
    """Check and create low stock notifications if needed"""
    if product.is_low_stock():
        notification = InventoryNotification.objects.create(
            product=product,
            notification_type='low_stock',
            message=f'Low stock alert for {product.product_name}'
        )
        managers = Group.objects.filter(name='Inventory Managers').first()
        if managers:
            notification.recipients.set(managers.user_set.all())

def _inventory_response(message):
    """Generate standardized inventory JSON response"""
    inventory_data = list(Inventory.objects.values(
        'id', 'product__product_name', 'batch_number', 
        'serial_number', 'quantity', 'location', 'last_updated'
    ))
    
    low_stock = list(Product.objects.annotate(
        total_quantity=Sum('inventory__quantity')
    ).filter(
        total_quantity__lt=F('low_stock_threshold')
    ).values('id', 'product_name', 'total_quantity', 'low_stock_threshold'))
    
    return JsonResponse({
        'success': True,
        'message': message,
        'inventory': inventory_data,
        'low_stock': low_stock
    })

"""
PRODUCT MANAGEMENT VIEWS
------------------------
Views for handling product-related operations
"""

def product_list(request):
    """Display list of all products"""
    products = Product.objects.all()
    return render(request, 'products.html', {'products': products})

def product_create(request):
    """Handle product creation"""
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            form.save()
            if request.user.is_authenticated:
                ActivityLog.objects.create(user=request.user, action='Created product')
            messages.success(request, 'Product added successfully!')
            return redirect('app1:product_list')
    else:
        form = ProductForm()
    return render(request, 'product_form.html', {'form': form})

"""
REPORTING & EXPORT VIEWS
------------------------
Views for handling reports and data exports
"""

def reports_exports(request):
    """Handle report generation and exports"""
    if request.method == 'POST':
        form = ExportForm(request.POST)
        if form.is_valid():
            report = form.save(commit=False)
            if request.user.is_authenticated:
                report.user = request.user
                ActivityLog.objects.create(user=request.user, action='Requested report export')
            report.save()
            messages.success(request, 'Export request saved successfully!')
            return redirect('app1:reports_exports')
    else:
        form = ExportForm()
    
    reports = ReportExport.objects.filter(user=request.user) if request.user.is_authenticated else ReportExport.objects.all()
    return render(request, 'reports_exports.html', {'form': form, 'reports': reports})

def generate_inventory_report(request):
    """Generate inventory report data (AJAX endpoint)"""
    if request.method == 'POST':
        start_date = request.POST.get('start_date')
        end_date = request.POST.get('end_date')
        inventory_items = Inventory.objects.all()
        
        if start_date and end_date:
            inventory_items = inventory_items.filter(last_updated__range=[start_date, end_date])
        
        if request.user.is_authenticated:
            ActivityLog.objects.create(user=request.user, action='Generated inventory report')
        
        return JsonResponse({
            'success': True,
            'message': 'Report generated successfully!',
            'data': list(inventory_items.values('product__product_name', 'quantity', 'location'))
        })
    return JsonResponse({'error': 'Invalid request'}, status=400)

def export_data(request):
    """Handle data export in various formats"""
    if request.method == 'POST':
        export_format = request.POST.get('export_format')
        
        if export_format == 'CSV':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="inventory_export.csv"'
            writer = csv.writer(response)
            writer.writerow(['Product', 'Batch Number', 'Serial Number', 'Quantity', 'Location'])
            for item in Inventory.objects.all():
                writer.writerow([
                    item.product.product_name,
                    item.batch_number,
                    item.serial_number,
                    item.quantity,
                    item.location
                ])
            if request.user.is_authenticated:
                ActivityLog.objects.create(user=request.user, action='Exported inventory as CSV')
            return response
        
        elif export_format == 'PDF':
            template = get_template('reports/inventory_pdf.html')
            context = {'inventory': Inventory.objects.all()}
            html = template.render(context)
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="inventory_export.pdf"'
            pisa_status = pisa.CreatePDF(html, dest=response)
            if pisa_status.err:
                return HttpResponse('Error generating PDF', status=500)
            if request.user.is_authenticated:
                ActivityLog.objects.create(user=request.user, action='Exported inventory as PDF')
            return response
        
        elif export_format == 'Excel':
            if request.user.is_authenticated:
                ActivityLog.objects.create(user=request.user, action='Attempted Excel export (not implemented)')
            return HttpResponse('Excel export not implemented yet', status=501)
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

"""
ACTIVITY & NOTIFICATION VIEWS
-----------------------------
Views for activity logs and notifications
"""

def inventory_history(request):
    """Display inventory history/logs"""
    history = InventoryHistory.objects.all().order_by('-transaction_date')
    return render(request, 'inventory_history.html', {'history': history})

def activity_log(request):
    """Display activity logs"""
    logs = ActivityLog.objects.filter(user=request.user) if request.user.is_authenticated else ActivityLog.objects.all()
    logs = logs.order_by('-timestamp')
    return render(request, 'activity_log.html', {'logs': logs})

@login_required
def get_notifications(request):
    """Get unread notifications for current user"""
    notifications = InventoryNotification.objects.filter(
        recipients=request.user
    ).order_by('-created_at')[:10].values(
        'id', 'message', 'created_at', 'is_read', 'product__id'
    )
    return JsonResponse({'notifications': list(notifications)})

@csrf_exempt
@login_required
def mark_notification_read(request, notification_id):
    """Mark single notification as read"""
    try:
        notification = InventoryNotification.objects.get(
            id=notification_id,
            recipients=request.user
        )
        notification.is_read = True
        notification.save()
        return JsonResponse({'success': True})
    except InventoryNotification.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Notification not found'}, status=404)

@csrf_exempt
@login_required
def mark_all_notifications_read(request):
    """Mark all notifications as read for current user"""
    updated = InventoryNotification.objects.filter(
        recipients=request.user,
        is_read=False
    ).update(is_read=True)
    return JsonResponse({'success': True, 'marked_read': updated})

"""
AUTHENTICATION VIEWS
--------------------
Views for user authentication and registration
"""

def register(request):
    """Handle user registration"""
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            ActivityLog.objects.create(user=user, action='Registered new user')
            messages.success(request, 'Registration successful! Welcome!')
            return redirect('app1:dashboard')
    else:
        form = RegistrationForm()
    return render(request, 'registration/register.html', {'form': form})

class CustomLoginView(LoginView):
    """Custom login view with activity logging"""
    template_name = 'registration/login.html'
    
    def post(self, request, *args, **kwargs):
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password', '').strip()
        
        # Skip authentication if no credentials provided
        if not username and not password:
            if request.user.is_authenticated:
                ActivityLog.objects.create(user=request.user, action='Skipped login as authenticated user')
            else:
                ActivityLog.objects.create(user=None, action='Skipped login as guest')
            return redirect(self.get_success_url())
        
        # Normal authentication
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            ActivityLog.objects.create(user=user, action='Logged in')
            return redirect(self.get_success_url())
        return self.form_invalid(self.get_form())

    def get_success_url(self):
        return reverse_lazy('app1:dashboard')