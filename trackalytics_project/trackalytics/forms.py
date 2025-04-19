from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from .models import CustomUser, InventoryItem, Reservation
import re

# ─────────────────────────────────────────────
#              Custom User Signup Form
# ─────────────────────────────────────────────

class SignUpForm(UserCreationForm):
    full_name = forms.CharField(
        max_length=100,
        required=True,
        label="Full name",
        help_text="Enter your full name"
    )

    class Meta:
        model = CustomUser
        fields = ['full_name', 'email', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']

        full_name = self.cleaned_data['full_name'].strip().split()
        user.first_name = full_name[0]
        user.last_name = ' '.join(full_name[1:]) if len(full_name) > 1 else ''

        if commit:
            user.save()
        return user


# ─────────────────────────────────────────────
#              Barcode Validator
# ─────────────────────────────────────────────

def validate_barcode(value):
    if value and not re.match(r'^\d{8,13}$', value):
        raise ValidationError("Barcode must be 8–13 digits (numbers only).")


# ─────────────────────────────────────────────
#              Inventory Item Form
# ─────────────────────────────────────────────

class InventoryForm(forms.ModelForm):
    class Meta:
        model = InventoryItem
        exclude = ['item_code', 'created_at']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 2}),
        }
        labels = {
            'item_name': 'Item Name',
            'barcode': 'Barcode (optional)',
            'category_type': 'Category',
            'quantity': 'Quantity in Stock',
            'vendor_price': 'Vendor Price ($)',
            'retail_price': 'Retail Price ($)',
            'notes': 'Additional Notes',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Default quantity
        self.fields['quantity'].initial = 0

        # Required fields
        self.fields['item_name'].required = True
        self.fields['category_type'].required = True

        # Optional fields loop
        optional_fields = ['barcode', 'vendor_price', 'retail_price', 'notes']
        for field in optional_fields:
            self.fields[field].required = False

        # Add barcode validator
        self.fields['barcode'].validators.append(validate_barcode)

        # Help texts (optional UX)
        self.fields['barcode'].help_text = "8–13 digit barcode (leave blank if not applicable)"
        self.fields['vendor_price'].help_text = "Internal cost (optional)"
        self.fields['retail_price'].help_text = "Selling price (optional)"


# ─────────────────────────────────────────────
#              Reservation Form
# ─────────────────────────────────────────────

class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = ['item', 'name', 'phone', 'email', 'campsite', 'quantity']
        widgets = {
            'campsite': forms.NumberInput(attrs={'min': 1, 'max': 10}),
            'quantity': forms.NumberInput(attrs={'min': 1, 'max': 5}),
        }
