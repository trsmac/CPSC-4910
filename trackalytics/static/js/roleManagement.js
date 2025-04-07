// static/js/role_management.js
document.addEventListener('DOMContentLoaded', function() {
    const addRoleBtn = document.getElementById('addRoleBtn');
    const roleModal = document.getElementById('roleModal');
    const closeModalBtn = document.querySelector('#roleModal .close');
    const cancelRoleBtn = document.getElementById('cancelRoleBtn');
    const roleForm = document.getElementById('roleForm');
    const roleModalTitle = document.getElementById('roleModalTitle');
    const roleIdInput = document.getElementById('roleId');

    // Open modal for adding new role
    addRoleBtn.addEventListener('click', function() {
        roleModalTitle.textContent = 'Create Role';
        roleIdInput.value = ''; // Clear any previous role ID
        roleForm.reset(); // Reset form
        roleModal.style.display = 'block';
    });

    // Close modal handlers
    [closeModalBtn, cancelRoleBtn].forEach(btn => {
        btn.addEventListener('click', function() {
            roleModal.style.display = 'none';
        });
    });

    // Role Form Submission
    roleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('roleName').value,
            description: document.getElementById('roleDescription').value,
            permissions: Array.from(
                document.querySelectorAll('input[name="permissions"]:checked')
            ).map(checkbox => checkbox.value)
        };

        const roleId = roleIdInput.value;
        const url = roleId
            ? `/roles/edit/${roleId}/`
            : '/roles/create/';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Refresh page or update UI dynamically
                    location.reload();
                } else {
                    alert('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while saving the role.');
            });
    });

    // Edit Role functionality
    document.querySelectorAll('.edit-role').forEach(btn => {
        btn.addEventListener('click', function() {
            const roleCard = this.closest('.role-card');
            const roleId = roleCard.dataset.roleId;

            // Fetch role details
            fetch(`/roles/details/${roleId}/`)
                .then(response => response.json())
                .then(role => {
                    // Populate modal
                    document.getElementById('roleName').value = role.name;
                    document.getElementById('roleDescription').value = role.description;
                    roleIdInput.value = roleId;
                    roleModalTitle.textContent = 'Edit Role';

                    // Check corresponding permissions
                    document.querySelectorAll('input[name="permissions"]').forEach(checkbox => {
                        checkbox.checked = role.permissions.includes(parseInt(checkbox.value));
                    });

                    roleModal.style.display = 'block';
                });
        });
    });

    // Delete Role functionality
    document.querySelectorAll('.delete-role').forEach(btn => {
        btn.addEventListener('click', function() {
            const roleCard = this.closest('.role-card');
            const roleId = roleCard.dataset.roleId;

            if (confirm('Are you sure you want to delete this role?')) {
                fetch(`/roles/delete/${roleId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            roleCard.remove();
                        } else {
                            alert('Error: ' + data.error);
                        }
                    });
            }
        });
    });

    // Utility function to get CSRF token
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