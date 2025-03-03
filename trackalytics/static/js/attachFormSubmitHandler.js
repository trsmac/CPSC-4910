function attachFormSubmitHandler() {
    const inventoryForm = document.getElementById("inventoryForm");
    const inventoryTableBody = document.getElementById("inventoryTableBody");
    const clearButton = document.getElementById("clearButton");

    if (!inventoryForm || !inventoryTableBody) {
        console.error("Form or Table not found!");
        return;
    }

    let itemNumberSet = new Set();

    inventoryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const itemName = document.getElementById("itemName").value;
        const itemNo = document.getElementById("itemNo").value;
        const batchNo = document.getElementById("batchNo").value || "N/A";
        const batchName = document.getElementById("batchName").value || "N/A";
        const quantity = document.getElementById("quantity").value;
        const description = document.getElementById("description").value || "N/A";

        if (!itemName || !itemNo || !quantity) {
            alert("Item, Item No., and Quantity are required.");
            return;
        }

        // Check for duplicate Item No.
        if (itemNumberSet.has(itemNo)) {
            alert("Error: Item No. already exists in the inventory.");
            return;
        }
        itemNumberSet.add(itemNo);

        const rowCount = inventoryTableBody.rows.length + 1;

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>${itemName}</td>
            <td>${itemNo}</td>
            <td>${batchNo}</td>
            <td>${batchName}</td>
            <td>${quantity}</td>
            <td>${description}</td>
        `;

        inventoryTableBody.appendChild(newRow);
        inventoryForm.reset();
    });

    clearButton.addEventListener("click", () => {
        inventoryForm.reset();
    });
}
