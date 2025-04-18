document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reservation-form");
    const modal = document.getElementById("reservation-modal");
    const viewBtn = document.getElementById("view-reservations-btn");
    const closeBtn = document.getElementById("close-modal");
    const saveBtn = document.getElementById("save-reservation-status");
  
    // 🧾 Form Submission
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = new FormData(form);
  
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { "X-CSRFToken": data.get("csrfmiddlewaretoken") }
      });
  
      if (res.ok) {
        alert("Reservation submitted.");
        form.reset();
      } else {
        alert("Something went wrong.");
      }
    });
  
    // 📅 Modal open
    viewBtn?.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  
    // ❌ Modal close
    closeBtn?.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  
    // 🔄 Save updated statuses
    saveBtn?.addEventListener("click", async () => {
      const rows = document.querySelectorAll("#reservations-table tbody tr");
      const updates = [];
  
      rows.forEach((row) => {
        const id = row.querySelector("select")?.dataset.id;
        const status = row.querySelector("select")?.value;
        if (id && status) {
          updates.push({ id, status });
        }
      });
  
      const res = await fetch("/reservations/update_status/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify({ updates })
      });
  
      if (res.ok) {
        alert("Statuses updated.");
        modal.classList.add("hidden");
      } else {
        alert("Failed to save.");
      }
    });
  
    // 🔎 Filter
    const filterInput = document.getElementById("filter-input");
    filterInput?.addEventListener("input", () => {
      const query = filterInput.value.toLowerCase();
      document.querySelectorAll("#reservations-table tbody tr").forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? "table-row" : "none";
      });
    });
  
    // ↕ Sort
    const sortSelect = document.getElementById("sort-select");
    sortSelect?.addEventListener("change", () => {
      const rows = Array.from(document.querySelectorAll("#reservations-table tbody tr"));
      const fieldIndex = sortSelect.value.includes("item") ? 0 : 1;
      const reverse = sortSelect.value.includes("desc");
  
      rows.sort((a, b) => {
        const textA = a.children[fieldIndex]?.textContent.trim().toLowerCase();
        const textB = b.children[fieldIndex]?.textContent.trim().toLowerCase();
        return reverse ? textB.localeCompare(textA) : textA.localeCompare(textB);
      });
  
      const tbody = document.querySelector("#reservations-table tbody");
      tbody.innerHTML = "";
      rows.forEach((row) => tbody.appendChild(row));
    });
  
    function getCSRFToken() {
      return document.querySelector("[name=csrfmiddlewaretoken]")?.value;
    }
  });
  