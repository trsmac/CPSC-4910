// Handles form submission
const form = document.getElementById("inventoryForm");
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
            sortSelect.dispatchEvent(new Event("change")); // Re-sort
        } else {
            alert("Error saving item. Check form fields.");
        }
    });
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// Renders new item in the list
function renderItem(item) {
    const ul = document.getElementById("inventoryItems");
    const li = document.createElement("li");

    li.className = "inventory-item";
    li.dataset.name = item.item_name.toLowerCase();
    li.dataset.quantity = item.quantity;
    li.dataset.created = item.created_at;

    li.innerHTML = `
        <div class="item-name">${item.item_name}</div>
        <div class="item-info">
            No: ${item.item_no} | Batch: ${item.batch_no} (${item.batch_name}) | Qty: ${item.quantity}<br>
            <em>${item.description}</em><br>
            <small>Added by ${item.user} on ${item.created_at_display}</small>
        </div>
        <button class="edit-btn" data-id="${item.id}">Edit</button>
    `;

    ul.appendChild(li);
}

// Real-time search
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("input", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll(".inventory-item").forEach(item => {
            item.style.display = item.dataset.name.includes(value) ? "block" : "none";
        });
    });
}

// Sorting
const sortSelect = document.getElementById("sortSelect");
if (sortSelect) {
    sortSelect.addEventListener("change", function () {
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
}
