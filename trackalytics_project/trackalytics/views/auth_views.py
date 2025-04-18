from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from .utils import get_client_ip
from ..models import ActivityLog
from ..forms import SignUpForm


def login_view(request):
    if request.user.is_authenticated:
        return redirect('trackalytics:main_dashboard')

    if request.method == 'POST':
        user = authenticate(request, email=request.POST['email'], password=request.POST['password'])
        if user:
            login(request, user)
            ActivityLog.objects.create(user=user, action="Logged in", ip_address=get_client_ip(request))
            return redirect('trackalytics:main_dashboard')
        messages.error(request, 'Invalid email or password.')
    return render(request, 'login.html')


def signup_view(request):
    if request.user.is_authenticated:
        return redirect('trackalytics:main_dashboard')

    form = SignUpForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.save()
        login(request, user)
        ActivityLog.objects.create(user=user, action="Signed up", ip_address=get_client_ip(request))
        return redirect('trackalytics:main_dashboard')

    return render(request, 'signup.html', {'form': form})


@login_required
def logout_view(request):
    ActivityLog.objects.create(user=request.user, action="Logged out", ip_address=get_client_ip(request))
    logout(request)
    return redirect('trackalytics:login')
