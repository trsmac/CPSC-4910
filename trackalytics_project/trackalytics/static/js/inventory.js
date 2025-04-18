document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inventoryForm");
    const toast = document.getElementById("toast");
    const clearBtn = document.getElementById("clearForm");
  
    function showToast(message) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3000);
    }
  
    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const response = await fetch(this.action || window.location.href, {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRFToken": formData.get("csrfmiddlewaretoken")
          }
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
  
    clearBtn?.addEventListener("click", () => {
      form?.reset();
    });
  
    // 🔍 Filter
    document.getElementById("searchInput").addEventListener("input", function () {
      const query = this.value.trim().toLowerCase();
      document.querySelectorAll(".inventory-item").forEach(item => {
        const name = (item.dataset.name || "").toLowerCase();
        const barcode = (item.dataset.barcode || "").toLowerCase();
        item.style.display = name.includes(query) || barcode.includes(query) ? "grid" : "none";
      });
    });
  
    const sortBy = document.getElementById("sortBy");
    const sortOrder = document.getElementById("sortOrder");
  
    function sortInventory() {
      const field = sortBy.value;
      const order = sortOrder.value;
      const items = Array.from(document.querySelectorAll(".inventory-item"));
  
      items.sort((a, b) => {
        let valA = a.dataset[field] || "";
        let valB = b.dataset[field] || "";
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
  
        if (!isNaN(numA) && !isNaN(numB)) {
          return order === "asc" ? numA - numB : numB - numA;
        }
  
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
        return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  
      const ul = document.getElementById("inventoryItems");
      ul.innerHTML = "";
      items.forEach(item => ul.appendChild(item));
    }
  
    sortBy.addEventListener("change", sortInventory);
    sortOrder.addEventListener("change", sortInventory);
    sortInventory();
  
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
        <span>${item.item_code}</span>
        <span>${item.item_name}</span>
        <span>${item.category_type}</span>
        <span><input type="number" class="qty-input" value="${item.quantity}" min="0"></span>
        <span>
          <button class="edit-btn btn btn-secondary">Edit</button>
          <span class="edit-actions hidden">
            <button class="save-btn btn btn-primary">Save</button>
            <button class="delete-btn btn btn-danger">Delete</button>
          </span>
        </span>
      `;
      ul.appendChild(li);
      attachItemEvents(li);
    }
  
    function attachItemEvents(item) {
      const id = item.dataset.id;
      const qtyInput = item.querySelector(".qty-input");
      const saveBtn = item.querySelector(".save-btn");
      const deleteBtn = item.querySelector(".delete-btn");
      const editBtn = item.querySelector(".edit-btn");
      const editActions = item.querySelector(".edit-actions");
  
      qtyInput?.addEventListener("change", () => {
        if (qtyInput.value < 0) qtyInput.value = 0;
      });
  
      editBtn?.addEventListener("click", () => {
        editActions.classList.remove("hidden");
      });
  
      saveBtn?.addEventListener("click", async () => {
        const quantity = parseInt(qtyInput.value);
        const response = await fetch(`/inventory/update/${id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCSRFToken(),
          },
          body: new URLSearchParams({ quantity }),
        });
  
        const data = await response.json();
        if (data.success) {
          showToast("Item updated.");
          editActions.classList.add("hidden");
          item.dataset.quantity = quantity;
        } else {
          alert("Error saving item.");
        }
      });
  
      deleteBtn?.addEventListener("click", async () => {
        if (!confirm("Delete this item?")) return;
        const response = await fetch(`/inventory/delete/${id}/`, {
          method: "POST",
          headers: { "X-CSRFToken": getCSRFToken() },
        });
  
        const data = await response.json();
        if (data.success) {
          item.remove();
          showToast("Item deleted.");
        } else {
          alert("Error deleting item.");
        }
      });
    }
  
    function getCSRFToken() {
      return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }
  
    document.querySelectorAll(".inventory-item").forEach(attachItemEvents);
  });
  