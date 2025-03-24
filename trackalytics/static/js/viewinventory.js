// trackalytics/static/js/viewinventory.js
function updateInventoryTable() {
    fetch('/inventory/', {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'  // Helps distinguish AJAX requests
        }
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#inventoryTable tbody');
        tbody.innerHTML = data.inventory.map(item => `
            <tr>
                <td>${item.product__product_name}</td>
                <td>${item.quantity}</td>
            </tr>
        `).join('');
    })
    .catch(error => console.error('Error updating inventory table:', error));
}