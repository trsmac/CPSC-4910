# app1/models.py

from django.db import models

# Products Table
class Product(models.Model):
    product_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# Inventory Table
class Inventory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    batch_number = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    serial_number = models.CharField(max_length=100, unique=True, db_index=True)
    quantity = models.IntegerField(default=0)
    location = models.CharField(max_length=255, blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)

# Inventory History Table
class InventoryHistory(models.Model):
    ACTION_CHOICES = [
        ('received', 'Received'),
        ('sold', 'Sold'),
        ('damaged', 'Damaged'),
        ('adjustment', 'Adjustment'),
    ]
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    quantity = models.IntegerField()
    transaction_date = models.DateTimeField(auto_now_add=True)

# Roles Table
class Role(models.Model):
    role_name = models.CharField(max_length=50, unique=True)

# Permissions Table
class Permission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission_name = models.CharField(max_length=100)

# Users Table
class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.TextField()
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# Activity Logs Table
class ActivityLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)  # Set default to a specific user (ID 1)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.action} on {self.timestamp}"

# Report Exports Table
class ReportExport(models.Model):
    FILE_FORMAT_CHOICES = [
        ('CSV', 'CSV'),
        ('PDF', 'PDF'),
        ('Excel', 'Excel'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    file_format = models.CharField(max_length=10, choices=FILE_FORMAT_CHOICES)
    file_name = models.CharField(max_length=255)
    generated_at = models.DateTimeField(auto_now_add=True)
