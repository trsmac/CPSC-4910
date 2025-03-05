function attachSearchHandler() {
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "searchInput";
    searchInput.placeholder = "Search...";
    searchInput.style.marginRight = "10px";

    if (searchButton) {
        // Add search input next to the search button
        searchButton.parentElement.insertBefore(searchInput, searchButton);

        searchButton.addEventListener("click", () => {
            const searchTerm = searchInput.value.toLowerCase();
            const rows = document.querySelectorAll("#inventoryTableBody tr");

            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                if (rowText.includes(searchTerm)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }
}