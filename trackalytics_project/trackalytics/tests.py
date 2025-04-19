from django.test import TestCase
from django.contrib.auth.models import User
from .models import InventoryItem, Reservation, ActivityLog
from django.urls import reverse

class InventoryItemTests(TestCase):
    def setUp(self):
        self.item = InventoryItem.objects.create(
            item_name="Tent",
            item_no="T001",
            batch_no="B001",
            batch_name="Summer Batch",
            quantity=10,
            description="Camping tent"
        )

    def test_item_creation(self):
        self.assertEqual(self.item.item_name, "Tent")
        self.assertEqual(self.item.quantity, 10)

    def test_unique_item_no(self):
        with self.assertRaises(Exception):
            InventoryItem.objects.create(
                item_name="Kayak",
                item_no="T001",  # Duplicate item_no
                batch_no="B002",
                batch_name="Water Batch",
                quantity=5
            )

class ReservationTests(TestCase):
    def setUp(self):
        self.reservation = Reservation.objects.create(
            item="Tent",
            name="John Doe",
            phone="1234567890",
            email="john@example.com",
            campsite=1,
            quantity=2,
            status="Checked Out"
        )

    def test_reservation_creation(self):
        self.assertEqual(self.reservation.name, "John Doe")
        self.assertEqual(self.reservation.campsite, 1)

class ViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

    def test_login_view(self):
        response = self.client.get(reverse('login'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'login.html')

    def test_main_dashboard_authenticated(self):
        self.client.login(username="testuser", password="testpass123")
        response = self.client.get(reverse('main_dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'main-dashboard.html')

    def test_main_dashboard_unauthenticated(self):
        response = self.client.get(reverse('main_dashboard'))
        self.assertEqual(response.status_code, 302)  # Redirects to login