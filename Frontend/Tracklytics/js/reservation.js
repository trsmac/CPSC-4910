// Dummy data for testing
const reservations = [
    {
        item: "Tent",
        name: "Ava Johnson",
        phone: "555-123-4567",
        email: "ava@example.com",
        campsite: 0,
        quantity: 2,
        status: "Checked Out"
    },
    {
        item: "Campsite",
        name: "Jordan Smith",
        phone: "555-987-6543",
        email: "jordan@example.com",
        campsite: 2,
        quantity: 0,
        status: "Returned"
    },
    {
        item: "Washing Machine",
        name: "Nia Carter",
        phone: "555-432-1098",
        email: "nia.carter@example.com",
        campsite: 3,
        quantity: 1,
        status: "Missing"
    },
    {
        item: "Campsite",
        name: "Ethan Brooks",
        phone: "555-678-1122",
        email: "ethan.brooks@example.com",
        campsite: 4,
        quantity: 0,
        status: "Checked Out"
    },
    {
        item: "Kayak",
        name: "Maya Lopez",
        phone: "555-234-7788",
        email: "maya.lopez@example.com",
        campsite: 5,
        quantity: 2,
        status: "Returned"
    }
];

const reservedCampsites = {
    1: true,
    2: true
};

// Reservation form handler
document.getElementById('reservation-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const email = document.getElementById('customer-email').value;
    const campsite = parseInt(document.getElementById('campsite-number').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const selectedItem = document.querySelector('input[name="equipment"]:checked');
    const warning = document.getElementById('campsite-warning');

    if (!selectedItem) {
        alert("Please select an item to reserve.");
        return;
    }

    if (reservedCampsites[campsite]) {
        warning.textContent = "Campsite number " + campsite + " is already reserved.";
        return;
    } else {
        warning.textContent = "";
    }

    const itemValue = selectedItem.value;

    reservations.push({
        item: itemValue,
        name,
        phone,
        email,
        campsite,
        quantity,
        status: "Checked Out"
    });

    reservedCampsites[campsite] = true;
    this.reset();

    if (selectedItem) {
        selectedItem.checked = false;
    }

    alert("Reservation successful!");
});

// Reusable render function with filter & sort
function renderReservationTable(filter = "", sort = "") {
    const tableBody = document.querySelector('#reservations-table tbody');
    tableBody.innerHTML = "";

    let filtered = [...reservations];

    // Filter
    if (filter) {
        const lower = filter.toLowerCase();
        filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(lower) ||
            r.item.toLowerCase().includes(lower)
        );
    }

    // Sort
    switch (sort) {
        case "name-asc":
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "name-desc":
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case "item-asc":
            filtered.sort((a, b) => a.item.localeCompare(b.item));
            break;
        case "item-desc":
            filtered.sort((a, b) => b.item.localeCompare(a.item));
            break;
    }

    // Render rows
    filtered.forEach((res, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${res.item}</td>
      <td>${res.name}</td>
      <td>${res.phone}</td>
      <td>${res.email}</td>
      <td>${res.campsite}</td>
      <td>${res.quantity}</td>
      <td>
        <select data-index="${index}">
          <option value="Checked Out"${res.status === "Checked Out" ? " selected" : ""}>Checked Out</option>
          <option value="Returned"${res.status === "Returned" ? " selected" : ""}>Returned</option>
          <option value="Missing"${res.status === "Missing" ? " selected" : ""}>Missing</option>
        </select>
      </td>
    `;
        tableBody.appendChild(row);
    });

    // Update status on dropdown change
    document.querySelectorAll('#reservations-table select').forEach(select => {
        select.addEventListener('change', function () {
            const idx = this.getAttribute('data-index');
            reservations[idx].status = this.value;
        });
    });
}

// Show modal
document.getElementById('view-reservations-btn').addEventListener('click', function () {
    renderReservationTable(); // ✅ show all by default
    document.getElementById('reservation-modal').style.display = 'flex';
});

// Close modal
document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('reservation-modal').style.display = 'none';
});

// Save and close
document.getElementById('save-reservation-status').addEventListener('click', function () {
    alert("Reservation statuses updated successfully!");
    document.getElementById('reservation-modal').style.display = 'none';
});

// Filter input
document.getElementById('filter-input').addEventListener('input', function () {
    const filter = this.value;
    const sort = document.getElementById('sort-select').value;
    renderReservationTable(filter, sort);
});

// Sort dropdown
document.getElementById('sort-select').addEventListener('change', function () {
    const sort = this.value;
    const filter = document.getElementById('filter-input').value;
    renderReservationTable(filter, sort);
});
