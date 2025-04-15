from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser, InventoryItem, Reservation

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

class InventoryForm(forms.ModelForm):
    class Meta:
        model = InventoryItem
        fields = ['item_name', 'item_no', 'batch_no', 'batch_name', 'quantity', 'description']
        widgets = {
            'item_name': forms.TextInput(attrs={'placeholder': 'e.g. Tent'}),
            'item_no': forms.TextInput(attrs={'placeholder': 'T001'}),
            'description': forms.Textarea(attrs={'rows': 2}),
        }


class ReservationForm(forms.ModelForm):
    class Meta:
        model = Reservation
        fields = ['item', 'name', 'phone', 'email', 'campsite', 'quantity']
        widgets = {
            'campsite': forms.NumberInput(attrs={'min': 1, 'max': 10}),
            'quantity': forms.NumberInput(attrs={'min': 1, 'max': 5}),
        }