function renderAddInventoryForm() {
    const contentArea = document.getElementById("contentArea");

    contentArea.innerHTML = `
        <div class="inventory-form card" style="width: 100%; margin: 0; padding: var(--card-padding); border-radius: var(--card-border-radius); box-shadow: var(--card-box-shadow); background-color: var(--card-background-color);">
            <h2 style="font-family: 'Poppins', sans-serif; font-size: 24px; font-weight: 700; color: var(--primary-color); margin-bottom: 20px; text-align: center;">
                Add New Product to Inventory
            </h2>
            <form id="inventoryForm">
                <div class="form-group" style="margin-bottom: 15px;">
                    <label for="productName" style="font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 500; color: var(--text-color); display: block; margin-bottom: 8px;">
                        Product Name:
                    </label>
                    <input type="text" id="productName" required
                        style="font-family: 'Inter', sans-serif; font-size: 16px; color: var(--text-color); width: 100%; padding: 12px; border: 1px solid var(--tertiary-color); border-radius: var(--border-radius); background: var(--background-color); transition: border-color 0.3s ease-in-out;">
                </div>
                <div class="form-group" style="margin-bottom: 15px;">
                    <label for="productQuantity" style="font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 500; color: var(--text-color); display: block; margin-bottom: 8px;">
                        Quantity:
                    </label>
                    <input type="number" id="productQuantity" min="1" required
                        style="font-family: 'Inter', sans-serif; font-size: 16px; color: var(--text-color); width: 100%; padding: 12px; border: 1px solid var(--tertiary-color); border-radius: var(--border-radius); background: var(--background-color); transition: border-color 0.3s ease-in-out;">
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label for="productDescription" style="font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 500; color: var(--text-color); display: block; margin-bottom: 8px;">
                        Description:
                    </label>
                    <textarea id="productDescription" placeholder="Optional" 
                        style="font-family: 'Inter', sans-serif; font-size: 16px; color: var(--text-color); width: 100%; padding: 12px; border: 1px solid var(--tertiary-color); border-radius: var(--border-radius); background: var(--background-color); transition: border-color 0.3s ease-in-out; resize: vertical; min-height: 120px;"></textarea>
                </div>
                <button type="submit" 
                    style="font-family: 'Poppins', sans-serif; font-size: 16px; font-weight: 600; color: white; background: var(--success-color); border: none; border-radius: var(--border-radius); padding: 15px 20px; width: 100%; cursor: pointer; transition: background 0.3s ease-in-out; text-align: center;">
                    Add Product
                </button>
            </form>
            <div id="inventoryDisplay" class="inventory-list" style="margin-top: 20px; font-family: 'Inter', sans-serif; font-size: 16px; color: var(--text-color);"></div>
        </div>
    `;
    attachFormSubmitHandler();
}
