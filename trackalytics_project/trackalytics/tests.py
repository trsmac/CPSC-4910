import json
import logging
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType
from trackalytics.models import CustomUser, InventoryItem

# Setup logging
logging.basicConfig(
    filename="test_logs.txt",
    filemode='w',
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def log(msg):
    print(msg)
    logging.info(msg)

# ─────────────────────────────────────────────
# 🔐 AUTHENTICATION TESTS
# ─────────────────────────────────────────────
class AuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse("trackalytics:signup")
        self.login_url = reverse("trackalytics:login")
        self.user = CustomUser.objects.create_user(email="testuser@example.com", password="testpass")

    def test_signup_page_and_form(self):
        log("📨 Testing Sign Up Page and Form Submission...")
        response = self.client.post(self.signup_url, {
            "full_name": "John Doe",
            "email": "john@example.com",
            "username": "johndoe",
            "password1": "ComplexPassword123",
            "password2": "ComplexPassword123"
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(CustomUser.objects.filter(email="john@example.com").exists())
        log("✅ Sign Up successful and user created.")

    def test_login_valid_user(self):
        log("🔐 Testing Login With Valid Credentials...")
        response = self.client.post(self.login_url, {
            "email": "testuser@example.com",
            "password": "testpass"
        })
        self.assertEqual(response.status_code, 302)
        log("✅ Login successful with correct credentials.")

    def test_login_invalid_user(self):
        log("❌ Testing Login With Invalid Credentials...")
        response = self.client.post(self.login_url, {
            "email": "invalid@example.com",
            "password": "wrongpass"
        })
        self.assertContains(response, "Invalid email or password.", status_code=200)
        log("✅ Login failed as expected with incorrect credentials.")


# ─────────────────────────────────────────────
# 🧱 ROLE MANAGEMENT TESTS
# ─────────────────────────────────────────────
class RoleManagementTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_user = CustomUser.objects.create_user(email="admin@example.com", password="adminpass", is_staff=True)
        self.normal_user = CustomUser.objects.create_user(email="user@example.com", password="userpass")
        self.admin_group = Group.objects.create(name="Admin")
        self.viewer_group = Group.objects.create(name="Viewer")
        change_perm = Permission.objects.get(codename="change_group")
        self.admin_user.user_permissions.add(change_perm)

    def test_assign_role_to_user_via_json(self):
        log("🔄 Testing role assignment via JSON...")
        self.client.login(email="admin@example.com", password="adminpass")
        response = self.client.post(
            reverse("trackalytics:roles"),
            data=json.dumps({"user_id": self.normal_user.id, "role_id": self.viewer_group.id}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn(self.viewer_group, self.normal_user.groups.all())
        log("✅ Role assignment successful.")

    def test_access_denied_without_permission(self):
        log("🔒 Testing access denied to roles view without permission...")
        self.client.login(email="user@example.com", password="userpass")
        response = self.client.get(reverse("trackalytics:roles"))
        self.assertTemplateUsed(response, "access_denied.html")
        log("✅ Access denied as expected.")


# ─────────────────────────────────────────────
# 📦 INVENTORY VIEW TESTS
# ─────────────────────────────────────────────
class InventoryViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user(email="user@test.com", password="pass123")
        self.editor = CustomUser.objects.create_user(email="editor@test.com", password="pass123")

        # Get existing or create new permissions to avoid duplicates
        content_type = ContentType.objects.get_for_model(InventoryItem)

        self.can_add, _ = Permission.objects.get_or_create(
            codename="can_add_inventory",
            name="Can Add Inventory",
            content_type=content_type
        )
        self.can_edit, _ = Permission.objects.get_or_create(
            codename="can_edit_inventory",
            name="Can Edit Inventory",
            content_type=content_type
        )
        self.can_delete, _ = Permission.objects.get_or_create(
            codename="can_delete_inventory",
            name="Can Delete Inventory",
            content_type=content_type
        )

        # Assign permissions to the editor
        self.editor.user_permissions.add(self.can_add, self.can_edit, self.can_delete)

        # Sample inventory item for edit/delete tests
        self.item = InventoryItem.objects.create(
            item_code="A123",
            item_name="Tent",
            category_type="Camping",
            quantity=5,
            vendor_price=100.0,
            retail_price=150.0
        )


    def test_inventory_page_requires_permission(self):
        log("🔒 Testing inventory page access without permission...")
        self.client.login(email="user@test.com", password="pass123")
        response = self.client.get(reverse("trackalytics:inventory"))
        self.assertEqual(response.status_code, 403)
        log("✅ Access denied as expected.")

    def test_inventory_page_loads_with_permission(self):
        log("🔓 Testing inventory page access with permission...")
        self.client.login(email="editor@test.com", password="pass123")
        response = self.client.get(reverse("trackalytics:inventory"))
        self.assertEqual(response.status_code, 200)
        log("✅ Inventory page loaded successfully.")

    def test_add_inventory_item(self):
        log("➕ Testing add inventory item...")
        self.client.login(email="editor@test.com", password="pass123")
        response = self.client.post(reverse("trackalytics:inventory"), {
            "item_code": "B456", "item_name": "Sleeping Bag", "category_type": "Camping",
            "quantity": 10, "vendor_price": 50.0, "retail_price": 80.0
        })
        self.assertEqual(response.status_code, 200)
        log("✅ Inventory item added successfully.")

    def test_update_inventory_item(self):
        log("✏️ Testing inventory item update...")
        self.client.login(email="editor@test.com", password="pass123")
        update_url = reverse("trackalytics:update_inventory", args=[self.item.id])
        response = self.client.post(update_url, {
            "item_name": "Updated Tent", "item_code": "A123", "category_type": "Camping",
            "quantity": 3, "vendor_price": 90.0, "retail_price": 140.0
        })
        self.assertEqual(response.status_code, 200)
        log("✅ Inventory item updated successfully.")

    def test_delete_inventory_item(self):
        log("❌ Testing inventory item deletion...")
        self.client.login(email="editor@test.com", password="pass123")
        delete_url = reverse("trackalytics:delete_inventory", args=[self.item.id])
        response = self.client.post(delete_url)
        self.assertEqual(response.status_code, 200)
        log("✅ Inventory item deleted successfully.")

    def test_inventory_item_display_name_length(self):
        log("📐 Testing inventory display for long item name...")
        self.client.login(email="editor@test.com", password="pass123")
        long_name = "Super Ultra Compact Lightweight Waterproof Tent 12-Person XL"
        InventoryItem.objects.create(
            item_code="X999", item_name=long_name, category_type="Camping",
            quantity=1, vendor_price=500.0, retail_price=800.0
        )
        response = self.client.get(reverse("trackalytics:inventory"))
        self.assertContains(response, long_name)
        log("✅ Long item name displayed correctly.")
