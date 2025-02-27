document.addEventListener("DOMContentLoaded", function() {
    const editButton = document.getElementById("editPermissionsBtn");
    const modal = document.getElementById("permissionsModal");
    const closeButton = document.querySelector(".close");
    const saveButton = document.getElementById("savePermissions");
    const checkboxes = document.querySelectorAll(".perm");
    const grantedList = document.getElementById("granted-list");
    const deniedList = document.getElementById("denied-list");

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

    // Open the modal when "Edit Permissions" is clicked
    editButton.addEventListener("click", function() {
        modal.style.display = "block";
    });

    // Close the modal when the "X" is clicked
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Close modal if user clicks outside of it
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Save and update permissions
    saveButton.addEventListener("click", function() {
        updateLists();
        modal.style.display = "none"; // Close modal
        alert("Permissions updated successfully!");
    });

    updateLists(); // Initialize lists on page load
});
