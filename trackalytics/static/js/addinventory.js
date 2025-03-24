// trackalytics/static/js/addinventory.js
function renderAddInventoryForm(products) {
    const contentArea = document.getElementById("contentArea");
    if (!contentArea) return;

    contentArea.innerHTML = `
        <div class="inventory-form card">
            <h2>Add New Inventory Item</h2>
            <form id="addInventoryForm" method="POST" action="/inventory/">
                <input type="hidden" name="csrfmiddlewaretoken" value="${getCsrfToken()}">
                <input type="hidden" name="add_inventory" value="true">
                <div class="form-group">
                    <label for="product">Product</label>
                    <select id="product" name="product" required>
                        ${products.map(product => `
                            <option value="${product.id}">${product.product_name}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="quantity">Quantity</label>
                    <input type="number" id="quantity" name="quantity" required>
                </div>
                <button type="submit" class="btn-primary">Add Item</button>
            </form>
        </div>
    `;
    
    document.getElementById('addInventoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const quantity = document.getElementById('quantity').value;
        if (quantity <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        const formData = new FormData(this);
        fetch('/inventory/', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.redirected) {  // Handle redirect as success
                updateInventoryTable();
                alert('Inventory item added successfully!');
            }
        })
        .catch(error => console.error('Error adding inventory:', error));
    });
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