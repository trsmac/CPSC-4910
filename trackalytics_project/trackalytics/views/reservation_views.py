from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from ..models import Reservation, ActivityLog
from ..forms import ReservationForm
from .utils import get_client_ip
import json

@login_required
def reservation(request):
    if request.method == 'POST':
        form = ReservationForm(request.POST)
        if form.is_valid():
            if Reservation.objects.filter(campsite=form.cleaned_data['campsite']).exists():
                return JsonResponse({'success': False, 'error': f"Campsite {form.cleaned_data['campsite']} is already reserved."})
            reservation = form.save()
            ActivityLog.objects.create(
                user=request.user,
                action=f"Created reservation for {reservation.name}",
                ip_address=get_client_ip(request),
            )
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'errors': form.errors})
    return render(request, 'reservation.html', {'reservations': Reservation.objects.all()})


@csrf_exempt
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
                ip_address=get_client_ip(request),
            )
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'error': 'Invalid request'})
