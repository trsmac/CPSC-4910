document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    const searchButton = document.getElementById('searchButton');
    const tableBody = document.getElementById('inventoryTableBody');

    saveButton.addEventListener('click', () => {
        const itemData = {
            item_name: document.getElementById('itemName').value,
            item_no: document.getElementById('itemNo').value,
            batch_no: document.getElementById('batchNo').value,
            batch_name: document.getElementById('batchName').value,
            quantity: document.getElementById('quantity').value,
            description: document.getElementById('description').value,
        };

        fetch('{% url "inventory" %}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: JSON.stringify(itemData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td></td>
                    <td>${itemData.item_name}</td>
                    <td>${itemData.item_no}</td>
                    <td>${itemData.batch_no}</td>
                    <td>${itemData.batch_name}</td>
                    <td>${itemData.quantity}</td>
                    <td>${itemData.description}</td>
                    <td></td>
                    <td></td>
                `;
                tableBody.appendChild(row);
                clearForm();
            } else {
                alert('Error saving item: ' + JSON.stringify(data.errors));
            }
        })
        .catch(error => console.error('Error:', error));
    });

    clearButton.addEventListener('click', () => {
        clearForm();
    });

    searchButton.addEventListener('click', () => {
        const query = document.getElementById('itemName').value;
        alert('Search functionality not implemented: ' + query);
    });

    function clearForm() {
        document.getElementById('itemName').value = '';
        document.getElementById('itemNo').value = '';
        document.getElementById('batchNo').value = '';
        document.getElementById('batchName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('description').value = '';
    }
});