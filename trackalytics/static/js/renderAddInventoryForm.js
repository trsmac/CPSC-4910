function renderAddInventoryForm() {
    const contentArea = document.getElementById("contentArea");

    contentArea.innerHTML = `
        <div class="inventory-form card" style="width: 80%; margin: auto; padding: 20px;">
            <h2 style="text-align: center;">Add New Product to Inventory</h2>
            <form id="inventoryForm">
                <div class="form-row" style="display: flex; gap: 10px;">
                    <div class="form-group" style="flex: 1;">
                        <label for="productName">Product Name:</label>
                        <input type="text" id="productName" required style="height: 30px; padding: 5px;">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label for="productQuantity">Quantity:</label>
                        <input type="number" id="productQuantity" min="1" required style="height: 30px; padding: 5px;">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label for="productDescription">Description:</label>
                        <input type="text" id="productDescription" placeholder="Optional" style="height: 30px; padding: 5px;">
                    </div>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 10px;">Add Product</button>
            </form>

            <h3 style="margin-top: 20px;">Current Inventory:</h3>
            <table id="inventoryTable" border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr>
                        <th style="padding: 10px;">Item</th>
                        <th style="padding: 10px;">Quantity</th>
                        <th style="padding: 10px;">Description</th>
                    </tr>
                </thead>
                <tbody id="inventoryTableBody"></tbody>
            </table>
        </div>
    `;

    attachFormSubmitHandler();
}
