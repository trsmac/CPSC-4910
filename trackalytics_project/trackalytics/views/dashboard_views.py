from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import InventoryItem, Reservation, CustomUser


def portal_redirect(request):
    return redirect('trackalytics:main_dashboard') if request.user.is_authenticated else redirect('trackalytics:login')


@login_required
def main_dashboard(request):
    context = {
        'total_inventory': InventoryItem.objects.count(),
        'low_stock_items': InventoryItem.objects.filter(quantity__lte=5).count(),
        'zero_stock_items': InventoryItem.objects.filter(quantity=0).count(),
    }
    return render(request, 'main-dashboard.html', context)


@login_required
def kpi_dashboard(request):
    context = {
        'total_reservations': Reservation.objects.count(),
        'active_users': CustomUser.objects.filter(is_active=True).count(),
        'turnover_rate': InventoryItem.objects.count(),
    }
    return render(request, 'kpi-dashboard.html', context)
