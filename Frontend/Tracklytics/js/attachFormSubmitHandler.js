function attachFormSubmitHandler() {
    const inventoryForm = document.getElementById("inventoryForm");
    const inventoryDisplay = document.getElementById("inventoryDisplay");

    // Prevent reattaching multiple event listeners
    if (inventoryForm.dataset.listenerAttached) return;
    inventoryForm.dataset.listenerAttached = "true";

    // Store inventory globally to persist data
    let inventoryData = [];

    inventoryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const productName = document.getElementById("productName").value;
        const productQuantity = document.getElementById("productQuantity").value;
        const productDescription = document.getElementById("productDescription").value;

        // Add the product to the inventory array
        inventoryData.push({ name: productName, quantity: productQuantity, description: productDescription });

        // Display the updated inventory
        inventoryDisplay.innerHTML = "<h3>Current Inventory:</h3>";
        inventoryData.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("inventory-item");
            itemElement.innerHTML = `
                <p>
                    <strong>${item.name}</strong> - Quantity: ${item.quantity} <br> 
                    Description: ${item.description}
                </p>
            `;
            inventoryDisplay.appendChild(itemElement);
        });

        inventoryForm.reset();
    });
}
