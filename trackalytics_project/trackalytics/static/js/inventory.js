document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inventoryForm");
    const toast = document.getElementById("toast");
    const clearBtn = document.getElementById("clearForm");

    function showToast(message) {
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
        li.dataset.barcode = item.barcode || "";
        li.dataset.quantity = item.quantity;
        li.dataset.created = item.created_at;

        li.innerHTML = `
            <div class="item-name">${item.item_code} — ${item.item_name}</div>
            <div class="item-info">
                ${item.category_type ? `Category: ${item.category_type} | ` : ""}
                Qty: ${item.quantity} |
                ${item.price ? `Price: $${item.price} | ` : ""}
                ${item.expiration_date ? `Expires: ${item.expiration_date} | ` : ""}
                ${item.barcode ? `Barcode: ${item.barcode}` : ""}<br>
                <em>${item.notes || ""}</em>
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
                showToast("Item saved!");
                renderItem(data.item);
                form.reset();
                sortInventory();
            } else {
                alert("Error saving item.");
            }
        });
    }

    clearBtn?.addEventListener("click", () => form?.reset());

    document.getElementById("searchInput").addEventListener("input", function () {
        const val = this.value.toLowerCase();
        document.querySelectorAll(".inventory-item").forEach(item => {
            const name = item.dataset.name || "";
            const barcode = item.dataset.barcode || "";
            item.style.display = name.includes(val) || barcode.includes(val) ? "block" : "none";
        });
    });

    const sortBy = document.getElementById("sortBy");
    const sortOrder = document.getElementById("sortOrder");

    function sortInventory() {
        const field = sortBy.value;
        const order = sortOrder.value;
        const items = Array.from(document.querySelectorAll(".inventory-item"));

        items.sort((a, b) => {
            let valA = a.dataset[field];
            let valB = b.dataset[field];

            if (!isNaN(valA)) valA = parseFloat(valA);
            if (!isNaN(valB)) valB = parseFloat(valB);

            return order === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

        const ul = document.getElementById("inventoryItems");
        ul.innerHTML = "";
        items.forEach(item => ul.appendChild(item));
    }

    sortBy.addEventListener("change", sortInventory);
    sortOrder.addEventListener("change", sortInventory);
    sortInventory();
});