# trackalytics/app1/admin.py

from django.contrib import admin
from .models import Product, Inventory, InventoryHistory, Role, Permission, User, ActivityLog, ReportExport

class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'category', 'created_at', 'updated_at')
    search_fields = ('product_name', 'category')
    list_filter = ('category', 'created_at')

admin.site.register(Product, ProductAdmin)
admin.site.register(Inventory)
admin.site.register(InventoryHistory)
admin.site.register(Role)
admin.site.register(Permission)
admin.site.register(User)
admin.site.register(ActivityLog)
admin.site.register(ReportExport)

