from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager


# ─────────────────────────────────────────────
#            Custom User Model & Manager
# ─────────────────────────────────────────────

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def get_full_name(self):
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name or self.email


# ─────────────────────────────────────────────
#              Inventory Item Model
# ─────────────────────────────────────────────

class InventoryItem(models.Model):
    CATEGORY_CHOICES = [
        ('G', 'Grocery & Food'),
        ('O', 'Camping & Outdoor'),
        ('P', 'Personal & Cleaning Supplies'),
        ('H', 'Hardware & Tools'),
        ('F', 'Bait & Tackle'),
        ('T', 'Tax-Exempt Items'),
        ('M', 'Miscellaneous/Other'),
    ]

    item_code = models.CharField(max_length=20, unique=True, blank=True, editable=False)
    item_name = models.CharField(max_length=100, unique=True)
    barcode = models.CharField(max_length=100, blank=True, null=True, unique=True)
    category_type = models.CharField(max_length=1, choices=CATEGORY_CHOICES)
    quantity = models.PositiveIntegerField(default=0)
    vendor_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    retail_price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.item_code:
            category = self.category_type or 'X'
            # Count existing items in this category
            count = InventoryItem.objects.filter(category_type=category).count() + 1
            self.item_code = f"{category}{str(count).zfill(6)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.item_name} ({self.item_code})"

    class Meta:
        ordering = ['item_name']
        verbose_name = "Inventory Item"
        verbose_name_plural = "Inventory Items"
        permissions = [
            ("can_add_inventory", "Can add inventory items"),
            ("can_edit_inventory", "Can edit inventory items"),
            ("can_delete_inventory", "Can delete inventory items"),
        ]

# ─────────────────────────────────────────────
#              Reservation Model
# ─────────────────────────────────────────────

class Reservation(models.Model):
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    campsite = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Site {self.campsite})"

    class Meta:
        ordering = ['-created_at']

# ─────────────────────────────────────────────
#              Activity Log Model
# ─────────────────────────────────────────────

class ActivityLog(models.Model):
    user = models.ForeignKey('trackalytics.CustomUser', on_delete=models.CASCADE)
    action = models.CharField(max_length=200)
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.action}"

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Activity Log"
        verbose_name_plural = "Activity Logs"
