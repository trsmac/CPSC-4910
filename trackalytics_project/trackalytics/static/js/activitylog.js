document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.querySelector('.filter-section form');
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(filterForm);
        fetch('{% url "activity_log" %}', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': '{{ csrf_token }}',
            },
        })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#activity-table tbody');
            tableBody.innerHTML = '';
            if (data.logs.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4">No activity logs available.</td></tr>';
            } else {
                data.logs.forEach(log => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${log.user}</td>
                        <td>${log.action}</td>
                        <td>${log.ip_address}</td>
                        <td>${log.timestamp}</td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error:', error));
    });
});