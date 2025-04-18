from .auth_views import login_view, signup_view, logout_view
from .dashboard_views import main_dashboard, kpi_dashboard
from .inventory_views import inventory, update_inventory, delete_inventory
from .reservation_views import reservation, update_reservations
from .role_views import roles, update_permissions
from .export_views import (
    export_inventory_csv,
    export_inventory_excel,
    export_inventory_json,
    export_inventory_pdf,
)
from .activity_views import activity_log, settings, reports

