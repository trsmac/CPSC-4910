document.addEventListener("DOMContentLoaded", () => {
    console.log("Inventory JS loaded ✅");

    const form = document.getElementById("inventoryForm");
    const sortBy = document.getElementById("sortBy");
    const sortOrder = document.getElementById("sortOrder");
    const clearBtn = document.getElementById("clearForm");
    const downloadBtn = document.getElementById("downloadCSV");

    function showToast(message) {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    }

    function renderItem(item) {
        const ul = document.getElementById("inventoryItems");
        const li = document.createElement("li");

        li.className = "inventory-item";
        li.dataset.id = item.id;
        li.dataset.name = item.item_name.toLowerCase();
        li.dataset.quantity = item.quantity;
        li.dataset.created = item.created_at;

        li.innerHTML = `
            <div class="item-name">${item.item_name}</div>
            <div class="item-info">
                No: ${item.item_no} | Batch: ${item.batch_no} (${item.batch_name}) | Qty: ${item.quantity}<br>
                <em>${item.description || ''}</em><br>
                <small>Added by ${item.user} on ${item.created_at_display}</small>
            </div>
            <div class="action-buttons">
                <div class="tooltip-wrapper">
                    <button class="edit-btn" data-id="${item.id}">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <span class="tooltip-text">Edit Item</span>
                </div>
            </div>
        `;

        ul.appendChild(li);
    }

    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            const formData = new FormData(this);

            const response = await fetch(this.action || window.location.href, {
                method: "POST",
                body: formData,
                headers: { "X-CSRFToken": formData.get("csrfmiddlewaretoken") }
            });

            const data = await response.json();
            if (data.success) {
                showToast("Item saved successfully!");
                renderItem(data.item);
                form.reset();
                sortInventory();
            } else {
                alert("Error saving item. Check form fields.");
            }
        });
    }

    clearBtn?.addEventListener("click", () => {
        form?.reset();
        form?.querySelector("[name='item_name']")?.focus();
    });

    document.getElementById("searchInput")?.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll(".inventory-item").forEach(item => {
            item.style.display = item.dataset.name.includes(value) ? "block" : "none";
        });
    });

    function sortInventory() {
        const field = sortBy?.value || "item_name";
        const order = sortOrder?.value || "asc";

        const items = Array.from(document.querySelectorAll(".inventory-item"));
        items.sort((a, b) => {
            let aVal = a.dataset[field];
            let bVal = b.dataset[field];

            if (!isNaN(aVal)) aVal = parseFloat(aVal);
            if (!isNaN(bVal)) bVal = parseFloat(bVal);

            if (order === "asc") {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        const ul = document.getElementById("inventoryItems");
        ul.innerHTML = "";
        items.forEach(item => ul.appendChild(item));
    }

    sortBy?.addEventListener("change", sortInventory);
    sortOrder?.addEventListener("change", sortInventory);

    downloadBtn?.addEventListener("click", () => {
        const rows = Array.from(document.querySelectorAll(".inventory-item"));
        const data = rows.map(row => {
            const name = row.querySelector(".item-name")?.textContent.trim();
            const info = row.querySelector(".item-info")?.textContent || '';
            const [itemNo, batchStr, qtyStr] = info.split('|').map(s => s.trim());
            const [_, batchNo, batchName] = batchStr.match(/Batch: (.*?) \((.*?)\)/) || [];
            const [__, quantity] = qtyStr.match(/Qty: (\d+)/) || [];
            const description = row.querySelector("em")?.textContent.trim();
            return [name, itemNo.replace('No: ', ''), batchNo, batchName, quantity, description];
        });

        const header = ['Item', 'Item No.', 'Batch No.', 'Batch Name', 'Quantity', 'Description'];
        data.unshift(header);

        const csvContent = data.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `inventory_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    document.getElementById("inventoryItems").addEventListener("click", async function (e) {
        const li = e.target.closest(".inventory-item");

        if (e.target.closest(".edit-btn")) {
            const itemId = li.dataset.id;
            const info = li.querySelector(".item-info");
            const itemName = li.querySelector(".item-name").textContent;
            const description = li.querySelector("em")?.textContent || "";
            const [itemNo, batchStr, qtyStr] = info.textContent.split('|').map(s => s.trim());
            const [_, batchNo, batchName] = batchStr.match(/Batch: (.*?) \((.*?)\)/) || [];
            const [__, quantity] = qtyStr.match(/Qty: (\d+)/) || [];

            li.dataset.original = li.innerHTML;
            li.classList.add("editing");

            li.innerHTML = `
                <div class="input-row">
                    <div class="form-group"><label>Item Name</label><input name="item_name" value="${itemName}" /></div>
                    <div class="form-group"><label>Item No</label><input name="item_no" value="${itemNo.replace('No: ', '')}" /></div>
                    <div class="form-group"><label>Batch No</label><input name="batch_no" value="${batchNo}" /></div>
                    <div class="form-group"><label>Batch Name</label><input name="batch_name" value="${batchName}" /></div>
                    <div class="form-group"><label>Quantity</label><input type="number" name="quantity" value="${quantity}" /></div>
                    <div class="form-group full-width"><label>Description</label><textarea name="description" rows="3">${description}</textarea></div>
                </div>
                <div class="action-buttons">
                    <button class="save-btn" data-id="${itemId}">Save</button>
                    <button class="cancel-btn">Cancel</button>
                </div>
            `;

            li.querySelector("input")?.focus();
        }

        if (e.target.classList.contains("save-btn")) {
            const itemId = e.target.dataset.id;
            const inputs = li.querySelectorAll("input, textarea");
            const formData = new FormData();
            inputs.forEach(input => formData.append(input.name, input.value));
            formData.append("csrfmiddlewaretoken", document.querySelector("[name='csrfmiddlewaretoken']").value);

            try {
                const response = await fetch(`/inventory/update/${itemId}/`, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    showToast("Item updated successfully!");
                    li.outerHTML = `
                        <li class="inventory-item"
                            data-id="${data.item.id}"
                            data-name="${data.item.item_name.toLowerCase()}"
                            data-quantity="${data.item.quantity}"
                            data-created="${data.item.created_at}">
                            <div class="item-name">${data.item.item_name}</div>
                            <div class="item-info">
                                No: ${data.item.item_no} | Batch: ${data.item.batch_no} (${data.item.batch_name}) | Qty: ${data.item.quantity}<br>
                                <em>${data.item.description || ''}</em><br>
                                <small>Updated by ${data.item.user} on ${data.item.created_at_display}</small>
                            </div>
                            <div class="action-buttons">
                                <div class="tooltip-wrapper">
                                    <button class="edit-btn" data-id="${data.item.id}">
                                        <span class="material-symbols-outlined">edit</span>
                                    </button>
                                    <span class="tooltip-text">Edit Item</span>
                                </div>
                            </div>
                        </li>
                    `;
                    sortInventory();
                } else {
                    alert("Update failed. Please check your inputs.");
                }
            } catch (err) {
                console.error("Update failed:", err);
                alert("Something went wrong while updating the item.");
            }
        }

        if (e.target.classList.contains("cancel-btn")) {
            li.innerHTML = li.dataset.original;
            li.classList.remove("editing");
        }
    });

    sortInventory();
});
