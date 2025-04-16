document.addEventListener("DOMContentLoaded", () => {
    console.log("Inventory JS loaded ✅");

    const form = document.getElementById("inventoryForm");
    const sortSelect = document.getElementById("sortSelect");

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
            <button class="edit-btn" data-id="${item.id}">Edit</button>
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
                sortSelect?.dispatchEvent(new Event("change"));
            } else {
                alert("Error saving item. Check form fields.");
            }
        });
    }

    document.getElementById("searchInput")?.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll(".inventory-item").forEach(item => {
            item.style.display = item.dataset.name.includes(value) ? "block" : "none";
        });
    });

    sortSelect?.addEventListener("change", function () {
        const value = this.value;
        const items = Array.from(document.querySelectorAll(".inventory-item"));

        items.sort((a, b) => {
            if (value === "quantity") {
                return b.dataset.quantity - a.dataset.quantity;
            } else if (value === "created_at") {
                return b.dataset.created.localeCompare(a.dataset.created);
            } else {
                return a.dataset.name.localeCompare(b.dataset.name);
            }
        });

        const ul = document.getElementById("inventoryItems");
        ul.innerHTML = "";
        items.forEach(item => ul.appendChild(item));
    });

    document.getElementById("inventoryItems").addEventListener("click", async function (e) {
        const li = e.target.closest(".inventory-item");

        if (e.target.classList.contains("edit-btn")) {
            const itemId = li.dataset.id;
            console.log("Editing item ID:", itemId);
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

            li.querySelector("input")?.focus(); // Autofocus for better UX
        }

        if (e.target.classList.contains("save-btn")) {
            const itemId = e.target.dataset.id;
            console.log("Saving item ID:", itemId);
            const inputs = li.querySelectorAll("input, textarea");
            const formData = new FormData();
            inputs.forEach(input => formData.append(input.name, input.value));
            formData.append("csrfmiddlewaretoken", document.querySelector("[name='csrfmiddlewaretoken']").value);

            try {
                const response = await fetch(`/inventory/update/${itemId}/`, {
                    method: "POST",
                    body: formData
                });

                const contentType = response.headers.get("content-type");
                if (!response.ok || !contentType?.includes("application/json")) {
                    throw new Error("Bad response from server");
                }

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
                                <button class="edit-btn" data-id="${data.item.id}">Edit</button>
                            </div>
                        </li>
                    `;
                    sortSelect?.dispatchEvent(new Event("change"));
                } else {
                    alert("Update failed. Please check your inputs.");
                }
            } catch (err) {
                console.error("Update failed:", err, "FormData:", Object.fromEntries(formData.entries()));
                alert("Something went wrong while updating the item.");
            }
        }

        if (e.target.classList.contains("cancel-btn")) {
            li.innerHTML = li.dataset.original;
            li.classList.remove("editing");
        }
    });

    sortSelect?.dispatchEvent(new Event("change"));
});
