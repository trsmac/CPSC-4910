from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.http import JsonResponse
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
            'item_name': forms.TextInput(attrs={'placeholder': 'Enter item name'}),
            'barcode': forms.TextInput(attrs={'placeholder': 'Enter barcode (optional)'}),
            'category_type': forms.Select(attrs={'placeholder': 'Select a category...'}),
            'quantity': forms.NumberInput(attrs={'placeholder': 'Enter quantity'}),
            'vendor_price': forms.NumberInput(attrs={'placeholder': 'Enter vendor price'}),
            'retail_price': forms.NumberInput(attrs={'placeholder': 'Enter retail price'}),
            'notes': forms.Textarea(attrs={'rows': 2, 'placeholder': 'Enter additional notes'}),
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

    def save_inventory_item(request):
        if request.method == "POST":
            # Extract data from the request
            item_name = request.POST.get("item_name")
            quantity = request.POST.get("quantity", 0)
            vendor_price = request.POST.get("vendor_price", 0)
            retail_price = request.POST.get("retail_price", 0)
            category_type = request.POST.get("category_type")
            barcode = request.POST.get("barcode", "")

            # Save the item to the database (example)
            item = InventoryItem.objects.create(
                item_name=item_name,
                quantity=quantity,
                vendor_price=vendor_price,
                retail_price=retail_price,
                category_type=category_type,
                barcode=barcode,
            )

            # Prepare the response data
            response_data = {
                "success": True,
                "item": {
                    "id": item.id,
                    "item_name": item.item_name,
                    "quantity": item.quantity,
                    "vendor_price": item.vendor_price,
                    "retail_price": item.retail_price,
                    "category_type": item.category_type,
                    "category_display": item.get_category_display(),  # Assuming a choice field
                    "barcode": item.barcode,
                },
            }
            return JsonResponse(response_data)

        return JsonResponse({"success": False, "error": "Invalid request method"})
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
