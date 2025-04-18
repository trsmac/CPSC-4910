document.addEventListener("DOMContentLoaded", () => {
    const permissionsModal = document.getElementById("permissionsModal");
    const assignModal = document.getElementById("assignRoleModal");
    const assignBtn = document.getElementById("assignConfirmBtn");
  
    // Open Permission Modal
    document.getElementById("editPermissionsBtn")?.addEventListener("click", () => {
      permissionsModal.classList.remove("hidden");
    });
  
    // Close Permission Modal
    document.getElementById("closePermissionsModal")?.addEventListener("click", () => {
      permissionsModal.classList.add("hidden");
    });
  
    // Save Permissions
    document.getElementById("savePermissions")?.addEventListener("click", async () => {
      const checked = document.querySelectorAll(".perm:checked");
      const permissions = Array.from(checked).map((input) => input.value);
  
      const res = await fetch("/roles/update_permissions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify({ permissions })
      });
  
      if (res.ok) {
        alert("Permissions updated.");
        permissionsModal.classList.add("hidden");
      } else {
        alert("Failed to update permissions.");
      }
    });
  
    // Open Assign Modal
    document.querySelector("[data-role='assign']")?.addEventListener("click", () => {
      assignModal.classList.remove("hidden");
    });
  
    // Close Assign Modal
    document.getElementById("assignClose")?.addEventListener("click", () => {
      assignModal.classList.add("hidden");
    });
  
    // Confirm Assign
    assignBtn?.addEventListener("click", async () => {
      const userId = document.querySelector("input[name='selectedUser']:checked")?.value;
      const roleSelect = document.querySelector(`input[name='selectedUser']:checked`)?.closest("tr")?.querySelector(".roleSelector");
      const role = roleSelect?.value;
  
      if (!userId || !role) {
        alert("Select a user and role.");
        return;
      }
  
      const res = await fetch("/roles/assign/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify({ user_id: userId, role })
      });
  
      if (res.ok) {
        alert("Role assigned.");
        assignModal.classList.add("hidden");
      } else {
        alert("Failed to assign role.");
      }
    });
  
    // Simple name filter
    document.getElementById("userSearch")?.addEventListener("input", function () {
      const term = this.value.toLowerCase();
      document.querySelectorAll("#userTable tbody tr").forEach((row) => {
        const name = row.children[1]?.textContent.toLowerCase();
        row.style.display = name.includes(term) ? "table-row" : "none";
      });
    });
  
    function getCSRFToken() {
      return document.querySelector("[name=csrfmiddlewaretoken]")?.value;
    }
  });
  