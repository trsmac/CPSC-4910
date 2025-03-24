function renderAddInventoryForm() {
    const contentArea = document.getElementById("contentArea");

    contentArea.innerHTML = `
        <div class="inventory-form card">
            <h2 style="text-align: center;">Add New Item to Inventory</h2>

            <table id="inventoryTable">
                <thead>
                    <tr>
                        <th></th>
                        <th>Item</th>
                        <th>Item No.</th>
                        <th>Batch No.</th>
                        <th>Batch Name</th>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>
                            <div class="sort-dropdown">
                                <button id="sortButton" class="sort-icon">
                                    <span class="material-symbols-outlined">sort</span>
                                </button>
                                <div id="sortDropdownContent" class="dropdown-content">
                                    <label for="sortOrder">Sort Order:</label>
                                    <select id="sortOrder">
                                        <option value="asc">A-Z</option>
                                        <option value="desc">Z-A</option>
                                    </select>
                                    <label for="sortBy">Sort By:</label>
                                    <select id="sortBy">
                                        <option value="item">Item</option>
                                        <option value="itemNo">Item No.</option>
                                        <option value="batchNo">Batch No.</option>
                                        <option value="batchName">Batch Name</option>
                                        <option value="quantity">Quantity</option>
                                    </select>
                                    <button id="sortOkButton">OK</button>
                                </div>
                            </div>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="entry-row">
                        <td>
                            <div class="tooltip-wrapper">
                            <button id="saveButton" class="save-icon">
                                <span class="material-symbols-outlined">save</span>
                            </button>
                            <span class="tooltip-text">Save item</span>
                            </div>
                        </td>
                        
                        <td><input type="text" id="itemName" placeholder="Item"></td>
                        <td><input type="text" id="itemNo" placeholder="Item No."></td>
                        <td><input type="text" id="batchNo" placeholder="Batch No."></td>
                        <td><input type="text" id="batchName" placeholder="Batch Name"></td>
                        <td><input type="number" id="quantity" placeholder="Quantity"></td>
                        <td><input type="text" id="description" placeholder="Description"></td>
                        <td>
                            <div class="tooltip-wrapper">
                                <button id="searchButton" class="search-icon">
                                    <span class="material-symbols-outlined">search</span>
                                </button>
                                <span class="tooltip-text">Search item</span>
                            </div>
                        </td>
                        
                        <td>
                          <div class="tooltip-wrapper">
                            <button id="clearButton" class="clear-icon">
                              <span class="material-symbols-outlined">delete</span>
                            </button>
                            <span class="tooltip-text">Clear fields</span>
                          </div>
                        </td>
                    </tr>
                </tbody>
                <tbody id="inventoryTableBody">
                    <!-- Inventory rows will be added here -->
                </tbody>
            </table>
        </div>
    `;

    // ✅ Fix: Call form handler after rendering HTML
    attachFormSubmitHandler();
    attachSortDropdownHandler(); // Optional: only if used
}
