# websocket_routing.py

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Handles inventory add/update/delete broadcasts
    re_path(r'^ws/inventory/$', consumers.InventoryConsumer.as_asgi()),
]