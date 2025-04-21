document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("inventoryForm");
  const toggleFormBtn = document.getElementById("toggleFormBtn");
  const formOverlay = document.getElementById("inventoryFormOverlay");


  toggleFormBtn?.addEventListener("click", () => {
    formOverlay?.classList.toggle("hidden");
  });

  document.querySelectorAll(".btn-delete").forEach(button => {
    button.addEventListener("click", async () => {
      const itemId = button.dataset.id;
      const response = await fetch(`/inventory/delete/${itemId}/`, {
        method: "POST",
        headers: { "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value }
      });

      const data = await response.json();
      if (data.success) {
        showToast(data.message);
        location.reload();
      } else {
        showToast(data.error, true);
      }
    });
  });

  document.querySelectorAll(".btn-edit").forEach(button => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.id;
      // Logic to populate the form with the item's data for editing
      showToast("Edit functionality not implemented yet", true);
    });
  });

  document.getElementById("cancelForm")?.addEventListener("click", () => {
    formOverlay.classList.add("hidden");
  });
  
  document.getElementById("exportBtn")?.addEventListener("click", () => {
    const rows = document.querySelectorAll("#inventoryTable tr");
    let csv = [];
  
    rows.forEach(row => {
      let cells = Array.from(row.querySelectorAll("th, td"));
      let rowData = cells.map(cell => `"${cell.textContent.trim()}"`).join(",");
      csv.push(rowData);
    });
  
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "inventory_export.csv";
    link.click();
  });
  
  document.getElementById("clearFormBtn")?.addEventListener("click", () => {
    form.reset();
  });  
  
  function showToast(message, isError = false, delay = 3000) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${isError ? "error" : ""} show`;

    // Automatically hide the toast after the specified delay
    setTimeout(() => {
        toast.className = "toast";
    }, delay);
}
  function updateInventorySummary() {
    const rows = document.querySelectorAll("#inventoryTable tbody tr");
    let totalVendor = 0;
    let totalRetail = 0;
    let totalItems = 0;

    rows.forEach(row => {
      const qty = parseInt(row.dataset.quantity) || 0;
      const vendor = parseFloat(row.dataset.vendor) || 0;
      const retail = parseFloat(row.dataset.retail) || 0;

      totalVendor += qty * vendor;
      totalRetail += qty * retail;
      totalItems += 1;
    });

    document.getElementById("totalVendorValue").textContent = `$ ${totalVendor.toFixed(2)}`;
    document.getElementById("totalRetailValue").textContent = `$ ${totalRetail.toFixed(2)}`;
    document.getElementById("totalProducts").textContent = totalItems;
  }

  updateInventorySummary();

  if (form) {
    form.addEventListener("submit", async function (e) {
      try {
        e.preventDefault();
        const formData = new FormData(this);
        const response = await fetch(this.action || window.location.href, {
          method: "POST",
          body: formData,
          headers: {
  "X-CSRFToken": formData.get("csrfmiddlewaretoken"),
  "X-Requested-With": "XMLHttpRequest"
}
        });

        const data = await response.json();
        if (data.success) {
          // Show a success message (optional)
          showToast("Item saved successfully!");

          // Hide the form overlay
          formOverlay.classList.add("hidden");

          // Refresh the page to show the new item
          location.reload();
        } else {
          // Show an error message
          showToast("Error saving item: " + (data.errors || "Unknown error"), true);
        }
      } catch (error) {
        // Handle any unexpected errors
        showToast("An error occurred while saving the item.", true);
      }
    });
  }
});