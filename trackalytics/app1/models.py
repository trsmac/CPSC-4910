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

class Permission(models.Model):
    """Defines individual permissions in the system"""
    name = models.CharField(max_length=100, unique=True)
    codename = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Role(models.Model):
    """Defines user roles with associated permissions"""
    ROLE_TYPES = [
        ('system', 'System Role'),
        ('custom', 'Custom Role')
    ]

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=20, choices=ROLE_TYPES, default='custom')
    permissions = models.ManyToManyField(Permission, related_name='roles')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    """Extended user profile with role management"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    roles = models.ManyToManyField(Role, related_name='user_profiles')
    last_role_change = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    department = models.CharField(max_length=100, blank=True, null=True)

    def assign_role(self, role):
        """Assign a role to the user"""
        self.roles.add(role)
        self.last_role_change = timezone.now()
        self.save()

    def remove_role(self, role):
        """Remove a role from the user"""
        self.roles.remove(role)
        self.last_role_change = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.user.username} Profile"

class RoleChangeLog(models.Model):
    """Logs changes to user roles"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=[
        ('assigned', 'Role Assigned'),
        ('removed', 'Role Removed')
    ])
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL,
                                     null=True, related_name='role_changes')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.role.name}"

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
