// trackalytics/static/js/role.js
document.addEventListener("DOMContentLoaded", function() {
    // Initialize role management
    const roleSelect = document.querySelector(".role-item[data-role]");
    if(roleSelect) roleSelect.click();

    document.getElementById("savePermissions").addEventListener("click", function(e) {
        e.preventDefault();
        
        const permissions = Array.from(document.querySelectorAll('.perm:checked'))
                            .map(checkbox => checkbox.value);

        fetch("{% url 'update_permissions' %}", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}'
            },
            body: JSON.stringify({
                role: selectedRole,
                permissions: permissions
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                updatePermissionLists(data.granted, data.denied);
            }
        });
    });

    function updatePermissionLists(granted, denied) {
        document.getElementById("granted-list").innerHTML = granted
            .map(p => `<li>${p}</li>`).join('');
        
        document.getElementById("denied-list").innerHTML = denied
            .map(p => `<li>${p}</li>`).join('');
    }
});