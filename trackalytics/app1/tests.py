# trackalytics/app1/tests.py

from django.test import TestCase
from .models import Product, Inventory

class ProductTestCase(TestCase):
    def setUp(self):
        Product.objects.create(product_name="Test Product", category="Test Category")
    
    def test_product_creation(self):
        product = Product.objects.get(product_name="Test Product")
        self.assertEqual(product.category, "Test Category")

class InventoryTestCase(TestCase):
    def setUp(self):
        product = Product.objects.create(product_name="Test Product", category="Test Category")
        Inventory.objects.create(product=product, quantity=100, serial_number="12345ABC")
    
    def test_inventory_creation(self):
        inventory = Inventory.objects.get(serial_number="12345ABC")
        self.assertEqual(inventory.quantity, 100)
