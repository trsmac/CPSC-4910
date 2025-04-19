document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservation-form');
    const modal = document.getElementById('reservation-modal');
    const viewBtn = document.getElementById('view-reservations-btn');
    const closeModal = document.getElementById('close-modal');
    const filterInput = document.getElementById('filter-input');
    const sortSelect = document.getElementById('sort-select');
    const saveStatusBtn = document.getElementById('save-reservation-status');
    let reservations = [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        fetch('{% url "reservation" %}', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': '{{ csrf_token }}',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Reservation successful!');
                form.reset();
                document.querySelectorAll('input[name="equipment"]').forEach(radio => radio.checked = false);
            } else {
                document.getElementById('campsite-warning').textContent = data.error;
            }
        })
        .catch(error => console.error('Error:', error));
    });

    viewBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        fetchReservations();
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    filterInput.addEventListener('input', () => {
        const query = filterInput.value.toLowerCase();
        renderTable(reservations.filter(r => 
            r.name.toLowerCase().includes(query) || r.item.toLowerCase().includes(query)
        ));
    });

    sortSelect.addEventListener('change', () => {
        const value = sortSelect.value;
        let sorted = [...reservations];
        if (value === 'name-asc') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (value === 'name-desc') {
            sorted.sort((a, b) => b.name.localeCompare(a.name));
        } else if (value === 'item-asc') {
            sorted.sort((a, b) => a.item.localeCompare(b.item));
        } else if (value === 'item-desc') {
            sorted.sort((a, b) => b.item.localeCompare(a.item));
        }
        renderTable(sorted);
    });

    saveStatusBtn.addEventListener('click', () => {
        const updates = [];
        document.querySelectorAll('#reservations-table select').forEach(select => {
            updates.push({
                id: select.dataset.id,
                status: select.value,
            });
        });
        fetch('/update-reservations/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: JSON.stringify(updates),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Status updated!');
                modal.style.display = 'none';
            }
        })
        .catch(error => console.error('Error:', error));
    });

    function fetchReservations() {
        fetch('{% url "reservation" %}')
        .then(response => response.json())
        .then(data => {
            reservations = data.reservations;
            renderTable(reservations);
        })
        .catch(error => console.error('Error:', error));
    }

    function renderTable(data) {
        const tbody = document.querySelector('#reservations-table tbody');
        tbody.innerHTML = '';
        data.forEach(r => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${r.item}</td>
                <td>${r.name}</td>
                <td>${r.phone}</td>
                <td>${r.email}</td>
                <td>${r.campsite}</td>
                <td>${r.quantity}</td>
                <td>
                    <select data-id="${r.id}">
                        <option value="Checked Out" ${r.status === 'Checked Out' ? 'selected' : ''}>Checked Out</option>
                        <option value="Returned" ${r.status === 'Returned' ? 'selected' : ''}>Returned</option>
                        <option value="Missing" ${r.status === 'Missing' ? 'selected' : ''}>Missing</option>
                    </select>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
});