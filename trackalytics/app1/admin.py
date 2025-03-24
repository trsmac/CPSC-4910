# trackalytics/app1/admin.py

from django.contrib import admin
from .models import Product, Inventory, InventoryHistory, Role, Permission, ActivityLog, ReportExport

# Inline Admin for InventoryHistory
class InventoryHistoryInline(admin.TabularInline):
    model = InventoryHistory
    extra = 1

# Product Admin
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'category', 'created_at', 'updated_at')
    search_fields = ('product_name', 'category')
    list_filter = ('category', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['mark_out_of_stock']

    def mark_out_of_stock(self, request, queryset):
        queryset.update(quantity=0)
    mark_out_of_stock.short_description = "Mark selected products as out of stock"

# Inventory Admin
class InventoryAdmin(admin.ModelAdmin):
    inlines = [InventoryHistoryInline]
    list_display = ('product', 'batch_number', 'serial_number', 'quantity', 'location', 'last_updated')
    search_fields = ('batch_number', 'serial_number')
    list_filter = ('location', 'last_updated')

# Inventory History Admin
class InventoryHistoryAdmin(admin.ModelAdmin):
    list_display = ('inventory', 'action', 'quantity', 'transaction_date')
    list_filter = ('action', 'transaction_date')

# Role Admin
class RoleAdmin(admin.ModelAdmin):
    list_display = ('role_name',)
    search_fields = ('role_name',)

# Permission Admin
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'permission_name')
    search_fields = ('permission_name',)
    list_filter = ('role',)

# Activity Log Admin
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'timestamp')
    search_fields = ('action',)
    list_filter = ('timestamp',)

# Report Export Admin
class ReportExportAdmin(admin.ModelAdmin):
    list_display = ('user', 'file_format', 'file_name', 'generated_at')
    search_fields = ('file_name',)
    list_filter = ('file_format', 'generated_at')

# Register Models
admin.site.register(Product, ProductAdmin)
admin.site.register(Inventory, InventoryAdmin)
admin.site.register(InventoryHistory, InventoryHistoryAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(Permission, PermissionAdmin)
admin.site.register(ActivityLog, ActivityLogAdmin)
admin.site.register(ReportExport, ReportExportAdmin)