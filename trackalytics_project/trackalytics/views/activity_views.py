from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from ..models import ActivityLog, CustomUser

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
def settings(request):
    return render(request, 'settings.html')


@login_required
def reports(request):
    return render(request, 'reports.html')


def access_denied(request):
    return render(request, 'access_denied.html')
