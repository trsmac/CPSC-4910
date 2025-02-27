document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.getElementById("editPermissionsBtn");
    const modal = document.getElementById("permissionsModal");
    const closeButton = document.querySelector(".modal .close");
    const saveButton = document.getElementById("savePermissions");
    const checkboxes = document.querySelectorAll(".perm");
    const grantedList = document.getElementById("granted-list");
    const deniedList = document.getElementById("denied-list");
    const roleItems = document.querySelectorAll(".role-item");
    const roleTitle = document.querySelector(".role-header h3");
    const roleDescription = document.querySelector(".role-description");

    // Define role data
    const roleData = {
        admin: {
            description: "Has access to all organization resources, including dashboards, and users.",
            permissions: ["dashboard1", "dashboard2", "dashboard3", "edit_inventory", "delete_inventory", "edit_roles", "export_import"]
        },
        editor: {
            description: "Can edit inventory and export reports but cannot manage users.",
            permissions: ["dashboard1", "dashboard2", "edit_inventory", "export_import"]
        },
        viewer: {
            description: "Can only view dashboards and inventory, no editing privileges.",
            permissions: ["dashboard1", "dashboard2", "dashboard3"]
        }
    };

    let selectedRole = "admin"; // Default role

    function updateRole(role) {
        selectedRole = role;
        roleTitle.textContent = role.charAt(0).toUpperCase() + role.slice(1) + " Role"; // Capitalize first letter
        roleDescription.textContent = roleData[role].description;

        // Update selected role button styles
        roleItems.forEach(item => {
            item.classList.remove("active");
            if (item.dataset.role === role) {
                item.classList.add("active");
            }
        });

        // Update permissions based on selected role
        checkboxes.forEach(checkbox => {
            checkbox.checked = roleData[role].permissions.includes(checkbox.value);
        });

        updateLists();
    }

    function updateLists() {
        grantedList.innerHTML = "";
        deniedList.innerHTML = "";

        checkboxes.forEach(checkbox => {
            const listItem = document.createElement("li");
            listItem.textContent = checkbox.parentElement.textContent.trim();

            if (checkbox.checked) {
                grantedList.appendChild(listItem);
            } else {
                deniedList.appendChild(listItem);
            }
        });
    }

    // Handle role selection
    roleItems.forEach(item => {
        item.addEventListener("click", function() {
            updateRole(this.dataset.role);
        });
    });

    // Open modal and retain checkbox state
    editButton.addEventListener("click", function() {
        modal.style.display = "block";
    });

    // Close modal when clicking "X"
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Close modal when clicking outside
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Save permissions and update lists
    saveButton.addEventListener("click", function() {
        let updatedPermissions = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                updatedPermissions.push(checkbox.value);
            }
        });

        roleData[selectedRole].permissions = updatedPermissions;
        updateLists();
        modal.style.display = "none";
        alert("Permissions updated for " + selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) + "!");
    });

    // Initialize lists with default role
    updateRole(selectedRole);
});
