function attachFormSubmitHandler() {
    const inventoryForm = document.getElementById("inventoryForm");
    const inventoryTableBody = document.getElementById("inventoryTableBody");

    // Prevent reattaching multiple event listeners
    if (inventoryForm.dataset.listenerAttached) return;
    inventoryForm.dataset.listenerAttached = "true";

    inventoryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const productName = document.getElementById("productName").value;
        const productQuantity = document.getElementById("productQuantity").value;
        const productDescription = document.getElementById("productDescription").value || "N/A";

        // Create a new row for the table
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td style="padding: 10px;">${productName}</td>
            <td style="padding: 10px;">${productQuantity}</td>
            <td style="padding: 10px;">${productDescription}</td>
        `;

        // Append the new row to the table
        inventoryTableBody.appendChild(newRow);

        // Reset the form fields
        inventoryForm.reset();
    });
}
