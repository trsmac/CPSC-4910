function renderAddInventoryForm() {
    const contentArea = document.getElementById("contentArea");

    contentArea.innerHTML = `
        <div class="inventory-form card">
            <h2 style="text-align: center;">Add New Item to Inventory</h2>

            <table id="inventoryTable" border="1">
                <thead>
                    <tr>
                        <th></th> <!-- Blank Space -->
                        <th>Item</th>
                        <th>Item No.</th>
                        <th>Batch No.</th>
                        <th>Batch Name</th>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>Actions</th>
                        <th></th> <!-- Blank Space -->
                    </tr>
                </thead>
                <tbody>
                    <!-- Row 1: Entry Fields -->
                    <tr class="entry-row">
                        <td></td> <!-- Blank Space -->
                        <td><input type="text" id="itemName" placeholder="Item"></td>
                        <td><input type="text" id="itemNo" placeholder="Item No."></td>
                        <td><input type="text" id="batchNo" placeholder="Batch No."></td>
                        <td><input type="text" id="batchName" placeholder="Batch Name"></td>
                        <td><input type="number" id="quantity" placeholder="Quantity"></td>
                        <td><input type="text" id="description" placeholder="Description"></td>
                        <td>
                            <button id="addItemButton" class="save-icon">
                                <span class="material-symbols-outlined">save</span>
                            </button>
                        </td>
                        <td></td> <!-- Blank Space -->
                    </tr>
                </tbody>
                <tbody id="inventoryTableBody">
                    <!-- Inventory rows will be added here dynamically -->
                </tbody>
            </table>

            <!-- Buttons Row -->
            <div class="form-buttons">
                <button type="button" id="searchButton">Search</button>
                <button type="button" id="clearButton" class="btn-danger">Clear</button>
            </div>
        </div>
    `;

    attachFormSubmitHandler();
}
