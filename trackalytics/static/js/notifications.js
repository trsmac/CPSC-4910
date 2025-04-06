// trackalytics/static/js/notifications.js

class NotificationManager {
    constructor() {
        this.notificationUrl = "{% url 'app1:inventory_stream' %}";
        this.markReadUrl = "{% url 'app1:mark_notification_read' %}";
        this.eventSource = null;
        this.init();
    }

    init() {
        // Toggle notifications panel
        document.getElementById('notifications-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            const panel = document.getElementById('notifications-panel');
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });

        // Mark all as read
        document.getElementById('clear-notifications').addEventListener('click', () => {
            this.markAllAsRead();
        });

        // Connect to SSE
        this.connectToEventSource();
    }

    connectToEventSource() {
        this.eventSource = new EventSource(this.notificationUrl);

        this.eventSource.onmessage = (e) => {
            const data = JSON.parse(e.data);
            this.updateNotifications(data.notifications);
        };

        this.eventSource.onerror = () => {
            setTimeout(() => this.connectToEventSource(), 5000);
        };
    }

    updateNotifications(notifications) {
        const badge = document.getElementById('notification-badge');
        const list = document.getElementById('notifications-list');
        
        // Update badge count
        const unreadCount = notifications.filter(n => !n.is_read).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'inline-block' : 'none';

        // Update notifications list
        list.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.is_read ? '' : 'unread'}" 
                 data-id="${notification.id}" 
                 data-product-id="${notification.product.id}">
                <div>${notification.message}</div>
                <div class="time">${new Date(notification.created_at).toLocaleString()}</div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleNotificationClick(item);
            });
        });
    }

    handleNotificationClick(item) {
        const notificationId = item.dataset.id;
        const productId = item.dataset.productId;
        
        // Mark as read
        fetch(`${this.markReadUrl}${notificationId}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': '{{ csrf_token }}',
                'Content-Type': 'application/json'
            }
        });

        // Redirect to inventory and highlight product
        window.location.href = `{% url 'app1:inventory' %}#product-${productId}`;
    }

    markAllAsRead() {
        fetch("{% url 'app1:mark_all_notifications_read' %}", {
            method: 'POST',
            headers: {
                'X-CSRFToken': '{{ csrf_token }}',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            document.getElementById('notification-badge').style.display = 'none';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NotificationManager();
});