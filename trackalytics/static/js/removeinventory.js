// trackalytics/static/js/removeinventory.js
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("removeInventoryForm");
    
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            formData.append('csrfmiddlewaretoken', getCsrfToken());
            formData.append('remove_inventory', 'true');  // Add the key expected by the view

            fetch("/inventory/", {  // Use the correct URL
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    updateInventoryList(data.inventory);
                    showNotification('Item removed successfully!');
                } else {
                    alert('Error removing item: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => console.error('Fetch error:', error));
        });
    }

    function updateInventoryList(inventory) {
        const tbody = document.querySelector("#inventoryTable tbody");
        if (tbody) {
            tbody.innerHTML = inventory.map(item => `
                <tr>
                    <td>${item.product_name}</td>
                    <td>${item.quantity}</td>
                    <!-- other fields -->
                </tr>
            `).join('');
        }
    }

    function showNotification(message) {
        alert(message);  // Replace with your notification system if available
    }

    function getCsrfToken() {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        return csrfToken || getCookie('csrftoken');
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});