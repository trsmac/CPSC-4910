from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Inventory, Product, ReportExport

# Form to add inventory
class AddInventoryForm(forms.ModelForm):
    class Meta:
        model = Inventory
        fields = ['product', 'batch_number', 'serial_number', 'quantity', 'location']
        widgets = {
            'product': forms.Select(attrs={'class': 'form-control'}),
            'batch_number': forms.TextInput(attrs={'class': 'form-control'}),
            'serial_number': forms.TextInput(attrs={'class': 'form-control'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-control', 'min': 0}),
            'location': forms.TextInput(attrs={'class': 'form-control'}),
        }

    def clean_serial_number(self):
        serial_number = self.cleaned_data['serial_number']
        if Inventory.objects.filter(serial_number=serial_number).exists():
            raise forms.ValidationError("This serial number already exists.")
        return serial_number

# Form to remove/update inventory
class RemoveInventoryForm(forms.ModelForm):
    class Meta:
        model = Inventory
        fields = ['product', 'quantity']
        widgets = {
            'product': forms.Select(attrs={'class': 'form-control'}),
            'quantity': forms.NumberInput(attrs={'class': 'form-control', 'min': 1}),
        }

    def clean_quantity(self):
        quantity = self.cleaned_data['quantity']
        product = self.cleaned_data.get('product')
        if product and quantity > product.inventory_set.first().quantity:
            raise forms.ValidationError("Quantity to remove exceeds available stock.")
        return quantity

# Form for exporting reports
class ExportForm(forms.ModelForm):
    class Meta:
        model = ReportExport
        fields = ['file_name', 'file_format']
        widgets = {
            'file_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter file name'}),
            'file_format': forms.Select(attrs={'class': 'form-control'}),
        }

    def clean_file_name(self):
        file_name = self.cleaned_data['file_name']
        if not file_name:
            raise forms.ValidationError("File name cannot be empty.")
        return file_name

# Form for adding/editing products
class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['product_name', 'description', 'category']
        widgets = {
            'product_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter product name'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'category': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter category'}),
        }

    def clean_product_name(self):
        product_name = self.cleaned_data['product_name']
        if not product_name:
            raise forms.ValidationError("Product name cannot be empty.")
        return product_name

# Form for user registration
class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Enter email'}))

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter username'}),
            'password1': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Enter password'}),
            'password2': forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Confirm password'}),
        }

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
        return user