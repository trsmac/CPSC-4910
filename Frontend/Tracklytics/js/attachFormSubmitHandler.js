function attachFormSubmitHandler() {
    const saveButton = document.getElementById("saveButton");
    const clearButton = document.getElementById("clearButton");
    const inventoryTableBody = document.getElementById("inventoryTableBody");

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `custom-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 100);

        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            const itemName = document.getElementById("itemName").value.trim();
            const itemNo = document.getElementById("itemNo").value.trim();
            const batchNo = document.getElementById("batchNo").value.trim();
            const batchName = document.getElementById("batchName").value.trim();
            const quantity = document.getElementById("quantity").value.trim();
            const description = document.getElementById("description").value.trim();

            if (!itemName || !itemNo || !quantity) {
                showToast("❌ Please fill out Item, Item No., and Quantity.", "error");
                return;
            }

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td></td>
                <td>${itemName}</td>
                <td>${itemNo}</td>
                <td>${batchNo}</td>
                <td>${batchName}</td>
                <td>${quantity}</td>
                <td>${description || "N/A"}</td>
                <td>
                    <div class="tooltip-wrapper">
                        <button class="edit-icon">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <span class="tooltip-text">Edit item</span>
                    </div>
                </td>
                <td></td>
            `;

            inventoryTableBody.appendChild(newRow);

            document.getElementById("itemName").value = "";
            document.getElementById("itemNo").value = "";
            document.getElementById("batchNo").value = "";
            document.getElementById("batchName").value = "";
            document.getElementById("quantity").value = "";
            document.getElementById("description").value = "";

            showToast("✅ Item successfully added!", "success");
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