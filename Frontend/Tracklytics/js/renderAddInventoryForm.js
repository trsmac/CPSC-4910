function renderAddInventoryForm() {
    contentArea.innerHTML = `
        <div class="inventory-form card" style="margin: 20px; max-width: 500px; padding: var(--card-padding);">
            <h2 style="font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: var(--primary-color); margin-bottom: 20px; text-align: center;">
                Add New Product to Inventory
            </h2>
            <form id="inventoryForm">
                <div class="form-group">
                    <label for="productName" style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-color); display: block; margin-bottom: 5px;">
                        Product Name:
                    </label>
                    <input type="text" id="productName" required
                        style="font-family: 'Inter', sans-serif; font-size: 14px; color: var(--text-color); width: 100%; padding: 10px; border: 1px solid var(--tertiary-color); border-radius: var(--border-radius); background: var(--background-color); transition: border-color 0.3s ease-in-out;">
                </div>
                <div class="form-group">
                    <label for="productQuantity" style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-color); display: block; margin-bottom: 5px;">
                        Quantity:
                    </label>
                    <input type="number" id="productQuantity" min="1" required
                        style="font-family: 'Inter', sans-serif; font-size: 14px; color: var(--text-color); width: 100%; padding: 10px; border: 1px solid var(--tertiary-color); border-radius: var(--border-radius); background: var(--background-color); transition: border-color 0.3s ease-in-out;">
                </div>
                <div class="form-group">
                    <label for="productDescription" style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: var(--text-color); display: block; margin-bottom: 5px;">
                        Description:
                    </label>
                    <textarea id="productDescription"
                        style="font-family: 'Inter', sans-serif; font-size: 14px; color: var(--text-color); width: 100%; padding: 10px; border: 1px solid var(--tertiary-color); border-radius: var(--border-radius); background: var(--background-color); transition: border-color 0.3s ease-in-out; resize: vertical; min-height: 100px;"></textarea>
                </div>
                <button type="submit"
                    style="font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600; color: var(--card-background-color); background: var(--success-color); border: none; border-radius: var(--border-radius); padding: 12px; width: 100%; cursor: pointer; transition: background 0.3s ease-in-out;">
                    Add Product
                </button>
            </form>
            <div id="inventoryDisplay" class="inventory-list" style="margin-top: 20px; font-family: 'Inter', sans-serif; font-size: 14px; color: var(--text-color);"></div>
        </div>
    `;
    attachFormSubmitHandler();
}