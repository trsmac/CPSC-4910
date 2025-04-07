document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.getElementById("editPermissionsBtn");
    const permissionsModal = document.getElementById("permissionsModal");
    const closePermissionsModal = document.getElementById("closePermissionsModal");
    const saveButton = document.getElementById("savePermissions");
    const checkboxes = document.querySelectorAll(".perm");
    const grantedList = document.getElementById("granted-list");
    const deniedList = document.getElementById("denied-list");
    const roleItems = document.querySelectorAll(".role-item");
    const roleTitle = document.querySelector(".role-header h3");
    const roleDescription = document.querySelector(".role-description");

    const assignRoleModal = document.getElementById("assignRoleModal");
    const assignClose = document.getElementById("assignClose");
    const userSearch = document.getElementById("userSearch");
    const sortOptions = document.getElementById("sortOptions");
    const filterOptions = document.getElementById("filterOptions");
    const sortName = document.getElementById("sortName");
    const sortRole = document.getElementById("sortRole");
    const assignConfirmBtn = document.getElementById("assignConfirmBtn");

    const users = [
        { name: "John Doe", role: "editor" },
        { name: "Alice Smith", role: "viewer" },
        { name: "Bob Johnson", role: "editor" },
        { name: "Carla Reyes", role: "admin" },
        { name: "Eli Black", role: "viewer" }
    ];

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

    let selectedRole = "admin";
    let sortBy = "name";
    let sortAsc = true;
    let selectedSort = "name";
    let selectedFilter = "all";

    function updateRole(role) {
        selectedRole = role;
        roleTitle.textContent = `${role.charAt(0).toUpperCase() + role.slice(1)} Role`;
        roleDescription.textContent = roleData[role]?.description || "";

        roleItems.forEach(item => {
            item.classList.toggle("active", item.dataset.role === role);
        });

        checkboxes.forEach(checkbox => {
            checkbox.checked = roleData[role]?.permissions.includes(checkbox.value);
        });

        updateLists();
    }

    function updateLists() {
        grantedList.innerHTML = "";
        deniedList.innerHTML = "";

        checkboxes.forEach(checkbox => {
            const li = document.createElement("li");
            li.textContent = checkbox.parentElement.textContent.trim();
            (checkbox.checked ? grantedList : deniedList).appendChild(li);
        });
    }

    function renderUserTable(data) {
        const tbody = document.getElementById("userTableBody");
        tbody.innerHTML = "";

        data.forEach((user, i) => {
            const role = user.role || "";
            tbody.innerHTML += `
      <tr>
        <td><input type="radio" name="selectedUser" id="userSelect${i}" value="${i}"></td>
        <td>${user.name}</td>
        <td>
          <select class="roleSelector" data-user-index="${i}">
            <option value="">Unassigned</option>
            <option value="admin" ${role === "admin" ? "selected" : ""}>Admin</option>
            <option value="editor" ${role === "editor" ? "selected" : ""}>Editor</option>
            <option value="viewer" ${role === "viewer" ? "selected" : ""}>Viewer</option>
          </select>
        </td>
      </tr>`;
        });

        // After table renders, auto-select row if dropdown is changed
        document.querySelectorAll(".roleSelector").forEach(select => {
            select.addEventListener("change", () => {
                const userIndex = select.getAttribute("data-user-index");
                document.getElementById(`userSelect${userIndex}`).checked = true;
            });
        });
    }



    function applyFilters() {
        const search = userSearch.value.toLowerCase();
        let filtered = users.filter(u => u.name.toLowerCase().includes(search));

        if (selectedFilter === "assigned") filtered = filtered.filter(u => u.role);
        else if (selectedFilter === "unassigned") filtered = filtered.filter(u => !u.role);
        else if (["admin", "editor", "viewer"].includes(selectedFilter)) filtered = filtered.filter(u => u.role === selectedFilter);

        filtered.sort((a, b) => {
            let aVal = sortBy === "name" ? a.name.split(" ").pop().toLowerCase() : (a.role || "");
            let bVal = sortBy === "name" ? b.name.split(" ").pop().toLowerCase() : (b.role || "");
            return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });

        renderUserTable(filtered);
    }

    function updateActiveList(parentEl, selectedAttr, value) {
        [...parentEl.children].forEach(li => {
            li.classList.toggle("active", li.dataset[selectedAttr] === value);
        });
    }

    roleItems.forEach(item => {
        item.addEventListener("click", () => {
            const role = item.dataset.role;
            if (role === "assign") {
                if (selectedRole === "admin") assignRoleModal.style.display = "block";
                else alert("Only Admins can assign roles.");
            } else {
                updateRole(role);
            }
        });
    });

    editButton.addEventListener("click", () => permissionsModal.style.display = "block");
    closePermissionsModal.addEventListener("click", () => permissionsModal.style.display = "none");
    assignClose.addEventListener("click", () => assignRoleModal.style.display = "none");

    window.addEventListener("click", (event) => {
        if (event.target === permissionsModal) permissionsModal.style.display = "none";
        if (event.target === assignRoleModal) assignRoleModal.style.display = "none";
    });

    saveButton.addEventListener("click", () => {
        roleData[selectedRole].permissions = [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);
        updateLists();
        permissionsModal.style.display = "none";
        alert("Permissions updated.");
    });

    userSearch.addEventListener("input", applyFilters);

    sortName.addEventListener("click", () => {
        sortBy = "name";
        sortAsc = !sortAsc;
        applyFilters();
    });
    const sortDropdown = document.getElementById("sortDropdown");
    const filterDropdown = document.getElementById("filterDropdown");

    sortDropdown.addEventListener("change", () => {
        selectedSort = sortDropdown.value;
        sortBy = selectedSort;
        sortAsc = true;
        applyFilters();
    });

    filterDropdown.addEventListener("change", () => {
        selectedFilter = filterDropdown.value;
        applyFilters();
    });

    sortRole.addEventListener("click", () => {
        sortBy = "role";
        sortAsc = !sortAsc;
        applyFilters();
    });

    assignConfirmBtn.addEventListener("click", () => {
        const selected = document.querySelector("input[name='selectedUser']:checked");
        if (!selected) return alert("Select a user.");

        const userIndex = +selected.value;
        const roleDropdown = document.querySelector(`.roleSelector[data-user-index="${userIndex}"]`);
        const newRole = roleDropdown.value;

        users[userIndex].role = newRole;
        alert(`${users[userIndex].name} has been assigned the role: ${newRole || "Unassigned"}`);

        applyFilters(); // Refresh table
        assignRoleModal.style.display = "none";
    });



    updateRole(selectedRole);
    updateActiveList(sortOptions, "sort", selectedSort);
    updateActiveList(filterOptions, "filter", selectedFilter);
    applyFilters();
});
