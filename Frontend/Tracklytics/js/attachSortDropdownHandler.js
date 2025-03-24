function attachSortDropdownHandler() {
    const sortButton = document.getElementById("sortButton");
    const sortDropdownContent = document.getElementById("sortDropdownContent");
    const sortOkButton = document.getElementById("sortOkButton");

    if (sortButton) {
        sortButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent the dropdown from closing immediately
            sortDropdownContent.style.display = "block";
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", () => {
            sortDropdownContent.style.display = "none";
        });

        // Handle OK button click
        if (sortOkButton) {
            sortOkButton.addEventListener("click", () => {
                const sortOrder = document.getElementById("sortOrder").value;
                const sortBy = document.getElementById("sortBy").value;
                alert(`Sort Order: ${sortOrder}, Sort By: ${sortBy}`); // Placeholder for sort logic
                sortDropdownContent.style.display = "none";
            });
        }
    }
}
