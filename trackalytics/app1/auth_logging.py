# trackalytics/auth_logging.py

import logging
import datetime
import json
import ipaddress
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.dispatch import receiver

# Configure the authentication logger
auth_logger = logging.getLogger('auth_events')
auth_logger.setLevel(logging.INFO)

# File handler for authentication events
if not auth_logger.handlers:
    auth_file_handler = logging.FileHandler('logs/auth_events.log')
    auth_file_handler.setLevel(logging.INFO)

    # Create a formatter with detailed information
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    auth_file_handler.setFormatter(formatter)
    auth_logger.addHandler(auth_file_handler)

class AuthEventLog(models.Model):
    """Model for storing authentication events in the database"""
    ACTIONS = (
        ('LOGIN_SUCCESS', 'Login Success'),
        ('LOGIN_FAILED', 'Login Failed'),
        ('LOGOUT', 'Logout'),
        ('PASSWORD_RESET', 'Password Reset'),
        ('PASSWORD_CHANGE', 'Password Change'),
    )

    user = models.CharField(max_length=150)  # Username
    action = models.CharField(max_length=20, choices=ACTIONS)
    ip_address = models.GenericIPAddressField(null=True)
    user_agent = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    details = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action} - {self.user} - {self.timestamp}"

def get_client_ip(request):
    """Extract client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR', '')

    # Validate the IP address
    try:
        ipaddress.ip_address(ip)
        return ip
    except ValueError:
        return None

def get_user_agent(request):
    """Extract user agent from request"""
    return request.META.get('HTTP_USER_AGENT', '')

def log_auth_event(user, action, request=None, details=None):
    """Log authentication events to both file and database"""
    username = user if isinstance(user, str) else user.username

    # Prepare log data
    log_data = {
        'username': username,
        'action': action,
        'timestamp': datetime.datetime.now().isoformat(),
    }

    if request:
        log_data['ip_address'] = get_client_ip(request)
        log_data['user_agent'] = get_user_agent(request)

    if details:
        log_data['details'] = details

    # Log to file
    auth_logger.info(json.dumps(log_data))

    # Log to database
    try:
        AuthEventLog.objects.create(
            user=username,
            action=action,
            ip_address=log_data.get('ip_address'),
            user_agent=log_data.get('user_agent'),
            details=details
        )
    except Exception as e:
        auth_logger.error(f"Failed to log to database: {str(e)}")

# Signal receivers
@receiver(user_logged_in)
def user_logged_in_callback(sender, request, user, **kwargs):
    log_auth_event(user, 'LOGIN_SUCCESS', request)

@receiver(user_logged_out)
def user_logged_out_callback(sender, request, user, **kwargs):
    log_auth_event(user, 'LOGOUT', request)

@receiver(user_login_failed)
def user_login_failed_callback(sender, credentials, request=None, **kwargs):
    username = credentials.get('username', 'unknown')
    log_auth_event(username, 'LOGIN_FAILED', request,
                  details={'reason': 'Invalid credentials'})

class SensitiveDataFilter(logging.Filter):
    """Filter to mask potentially sensitive data in logs"""

    def __init__(self, patterns=None):
        super().__init__()
        self.patterns = patterns or [
            (r'password=.*?(&|$)', 'password=*****\\1'),
            (r'token=.*?(&|$)', 'token=*****\\1'),
        ]

    def filter(self, record):
        if isinstance(record.msg, str):
            for pattern, replacement in self.patterns:
                record.msg = re.sub(pattern, replacement, record.msg)
        return True

# Add the filter to your file handler
auth_file_handler.addFilter(SensitiveDataFilter())