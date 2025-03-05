function attachFormSubmitHandler() {
    const addItemButton = document.getElementById("addItemButton");
    const clearButton = document.getElementById("clearButton");
    const inventoryTableBody = document.getElementById("inventoryTableBody");

    if (addItemButton) {
        addItemButton.addEventListener("click", () => {
            const itemName = document.getElementById("itemName").value;
            const itemNo = document.getElementById("itemNo").value;
            const batchNo = document.getElementById("batchNo").value;
            const batchName = document.getElementById("batchName").value;
            const quantity = document.getElementById("quantity").value;
            const description = document.getElementById("description").value;

            // Create a new row for the table
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td></td> <!-- Blank Space -->
                <td>${itemName}</td>
                <td>${itemNo}</td>
                <td>${batchNo}</td>
                <td>${batchName}</td>
                <td>${quantity}</td>
                <td>${description}</td>
                <td>
                    <button class="edit-icon">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                </td>
                <td></td> <!-- Blank Space -->
            `;

            // Append the new row to the table
            inventoryTableBody.appendChild(newRow);

            // Clear the input fields
            document.getElementById("itemName").value = "";
            document.getElementById("itemNo").value = "";
            document.getElementById("batchNo").value = "";
            document.getElementById("batchName").value = "";
            document.getElementById("quantity").value = "";
            document.getElementById("description").value = "";
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            document.getElementById("itemName").value = "";
            document.getElementById("itemNo").value = "";
            document.getElementById("batchNo").value = "";
            document.getElementById("batchName").value = "";
            document.getElementById("quantity").value = "";
            document.getElementById("description").value = "";
        });
    }
}