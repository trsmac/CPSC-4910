document.addEventListener("DOMContentLoaded", () => {
    const addInventoryLink = document.getElementById("addInventoryLink");
    const contentArea = document.getElementById("contentArea");

    // Render the "Add Inventory" form
    function renderAddInventoryForm() {
        contentArea.innerHTML = `
            <div class="inventory-form card">
                <h2>Add New Product to Inventory</h2>
                <form id="inventoryForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productName">Product Name:</label>
                            <input type="text" id="productName" required>
                        </div>
                        <div class="form-group">
                            <label for="productQuantity">Quantity:</label>
                            <input type="number" id="productQuantity" min="1" required>
                        </div>
                        <div class="form-group">
                            <label for="productDescription">Description:</label>
                            <textarea id="productDescription"></textarea>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Add Product</button>
                </form>
                <div id="inventoryDisplay" class="inventory-list"></div>
            </div>
        `;
        attachFormSubmitHandler();
    }

    // Handle form submission
    function attachFormSubmitHandler() {
        const inventoryForm = document.getElementById("inventoryForm");
        const inventoryDisplay = document.getElementById("inventoryDisplay");
        const inventoryData = [];

        inventoryForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const productName = document.getElementById("productName").value;
            const productQuantity = document.getElementById("productQuantity").value;
            const productDescription = document.getElementById("productDescription").value;

            // Add the product to the inventory array
            inventoryData.push({ name: productName, quantity: productQuantity, description: productDescription });

            // Clear the inventory display
            inventoryDisplay.innerHTML = "<h3>Current Inventory:</h3>";

            // Create a container for the inventory items
            const itemsContainer = document.createElement("div");
            itemsContainer.classList.add("inventory-items");

            // Add each inventory item to the container
            inventoryData.forEach((item, index) => {
                const itemElement = document.createElement("div");
                itemElement.classList.add("inventory-item");
                itemElement.innerHTML = `
                    <p>
                        <strong>${item.name}</strong> - Quantity: ${item.quantity} <br> 
                        Description: ${item.description}
                    </p>
                `;
                itemsContainer.appendChild(itemElement);
            });

            // Append the items container to the inventory display
            inventoryDisplay.appendChild(itemsContainer);

            // Reset the form
            inventoryForm.reset();
        });
    }

    // Load the form when "Add Inventory" is clicked
    addInventoryLink.addEventListener("click", (event) => {
        event.preventDefault();
        renderAddInventoryForm();
    });
});
