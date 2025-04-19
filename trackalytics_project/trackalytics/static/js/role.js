document.addEventListener('DOMContentLoaded', () => {
    const roleItems = document.querySelectorAll('.role-item');
    const permissionsModal = document.getElementById('permissionsModal');
    const assignRoleModal = document.getElementById('assignRoleModal');
    const editPermissionsBtn = document.getElementById('editPermissionsBtn');
    const closePermissionsModal = document.getElementById('closePermissionsModal');
    const savePermissions = document.getElementById('savePermissions');
    const assignClose = document.getElementById('assignClose');
    const assignConfirmBtn = document.getElementById('assignConfirmBtn');
    const userSearch = document.getElementById('userSearch');

    roleItems.forEach(item => {
        item.addEventListener('click', () => {
            roleItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const role = item.dataset.role;
            document.querySelector('.role-header h3').textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Role`;
            // Fetch permissions (placeholder)
            updatePermissionsList(role);
        });
    });

    editPermissionsBtn.addEventListener('click', () => {
        permissionsModal.style.display = 'block';
    });

    closePermissionsModal.addEventListener('click', () => {
        permissionsModal.style.display = 'none';
    });

    savePermissions.addEventListener('click', () => {
        const permissions = Array.from(document.querySelectorAll('.perm:checked')).map(cb => cb.value);
        fetch('/update-permissions/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: JSON.stringify({ role: document.querySelector('.role-item.active').dataset.role, permissions }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                permissionsModal.style.display = 'none';
                updatePermissionsList(document.querySelector('.role-item.active').dataset.role);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    roleItems.forEach(item => {
        if (item.dataset.role === 'assign') {
            item.addEventListener('click', () => {
                assignRoleModal.style.display = 'block';
            });
        }
    });

    assignClose.addEventListener('click', () => {
        assignRoleModal.style.display = 'none';
    });

    assignConfirmBtn.addEventListener('click', () => {
        const selectedUser = document.querySelector('input[name="selectedUser"]:checked');
        if (selectedUser) {
            const userId = selectedUser.value;
            const role = document.querySelector(`.roleSelector[data-user-id="${userId}"]`).value;
            fetch('{% url "roles" %}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
                body: JSON.stringify({ user_id: userId, role_id: role }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    assignRoleModal.style.display = 'none';
                    alert('Role assigned!');
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });

    userSearch.addEventListener('input', () => {
        const query = userSearch.value.toLowerCase();
        const rows = document.querySelectorAll('#userTableBody tr');
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            row.style.display = name.includes(query) ? '' : 'none';
        });
    });

    function updatePermissionsList(role) {
        const grantedList = document.getElementById('granted-list');
        const deniedList = document.getElementById('denied-list');
        // Placeholder: Fetch permissions dynamically
        grantedList.innerHTML = '<li>View Dashboard</li><li>Manage Inventory</li>';
        deniedList.innerHTML = '<li>Delete Users</li>';
    }
});