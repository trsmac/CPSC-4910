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

        // Display the updated inventory
        inventoryDisplay.innerHTML = "<h3>Current Inventory:</h3>";
        inventoryData.forEach((item, index) => {
            inventoryDisplay.innerHTML += `
                <p>
                    <strong>${item.name}</strong> - Quantity: ${item.quantity} <br> 
                    Description: ${item.description}
                </p>
            `;
        });

        // Reset the form
        inventoryForm.reset();
    });
}
