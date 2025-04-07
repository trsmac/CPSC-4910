# app1/management/commands/setup_rbac.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from app1.models import Role, Permission, UserRole

class Command(BaseCommand):
    help = 'Setup initial roles and permissions for RBAC'

    def handle(self, *args, **kwargs):
        self.stdout.write('Setting up RBAC permissions and roles...')

        # Create default permissions
        permissions = [
            # Dashboard
            ('view_dashboard', 'Can view dashboards'),
            # Inventory
            ('view_inventory', 'Can view inventory items'),
            ('add_inventory', 'Can add new inventory items'),
            ('edit_inventory', 'Can edit inventory items'),
            ('delete_inventory', 'Can delete inventory items'),
            ('view_inventory_history', 'Can view inventory history'),
            # Products
            ('view_products', 'Can view products'),
            ('add_products', 'Can add new products'),
            ('edit_products', 'Can edit products'),
            ('delete_products', 'Can delete products'),
            # Reports
            ('generate_reports', 'Can generate reports'),
            ('export_data', 'Can export data to CSV/PDF'),
            # Logs
            ('view_logs', 'Can view activity logs'),
            # User management
            ('manage_users', 'Can manage users'),
            ('manage_roles', 'Can manage roles and permissions'),
        ]

        for codename, name in permissions:
            Permission.objects.get_or_create(
                codename=codename,
                defaults={'name': name, 'description': name}
            )
            self.stdout.write(f'Created permission: {codename}')

        # Create default roles
        roles = {
            'Admin': {
                'description': 'Has access to all organization resources, including dashboards, and users.',
                'permissions': [p[0] for p in permissions],  # All permissions
                'is_default': True
            },
            'Editor': {
                'description': 'Can edit inventory and export reports but cannot manage users.',
                'permissions': [
                    'view_dashboard', 'view_inventory', 'add_inventory', 'edit_inventory', 'view_inventory_history',
                    'view_products', 'add_products', 'edit_products', 'generate_reports', 'export_data', 'view_logs'
                ],
                'is_default': True
            },
            'Viewer': {
                'description': 'Can only view dashboards and inventory, no editing privileges.',
                'permissions': [
                    'view_dashboard', 'view_inventory', 'view_inventory_history',
                    'view_products', 'generate_reports', 'view_logs'
                ],
                'is_default': True
            }
        }

        for role_name, role_data in roles.items():
            role, created = Role.objects.get_or_create(
                name=role_name,
                defaults={
                    'description': role_data['description'],
                    'is_default': role_data['is_default']
                }
            )

            # Assign permissions to role
            for perm_codename in role_data['permissions']:
                perm = Permission.objects.get(codename=perm_codename)
                role.permissions.add(perm)

            if created:
                self.stdout.write(f'Created role: {role_name}')
            else:
                self.stdout.write(f'Updated role: {role_name}')

        # Assign admin role to superusers
        admin_role = Role.objects.get(name='Admin')
        for superuser in User.objects.filter(is_superuser=True):
            UserRole.objects.get_or_create(
                user=superuser,
                role=admin_role
            )
            self.stdout.write(f'Assigned Admin role to superuser: {superuser.username}')

        self.stdout.write(self.style.SUCCESS('RBAC setup completed successfully!'))