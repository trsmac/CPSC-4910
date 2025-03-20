function renderAddInventoryForm() {
    const contentArea = document.getElementById("contentArea");

    contentArea.innerHTML = `
        <div class="inventory-form card">
            <h2 style="text-align: center;">Inventory</h2>

            <table id="inventoryTable">
                <thead>
                    <tr>
                        <th></th> <!-- Blank Space -->
                        <th>Item</th>
                        <th>Item No.</th>
                        <th>Batch No.</th>
                        <th>Batch Name</th>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th></th> <!-- Blank Space -->
                        <th></th> <!-- Blank Space -->
                    </tr>
                </thead>
                <tbody>
                    <!-- Row 2: Entry Fields and Buttons -->
                    <tr class="entry-row">
                        <td>
                            <button id="saveButton" class="save-icon">
                                <span class="material-symbols-outlined">save</span>
                            </button>
                        </td>
                        <td><input type="text" id="itemName" placeholder="Item"></td>
                        <td><input type="text" id="itemNo" placeholder="Item No."></td>
                        <td><input type="text" id="batchNo" placeholder="Batch No."></td>
                        <td><input type="text" id="batchName" placeholder="Batch Name"></td>
                        <td><input type="number" id="quantity" placeholder="Quantity"></td>
                        <td><input type="text" id="description" placeholder="Description"></td>
                        <td>
                            <button id="searchButton" class="search-icon">
                                <span class="material-symbols-outlined">search</span>
                            </button>
                        </td>
                        <td>
                            <button id="clearButton" class="clear-icon">
                                <span class="material-symbols-outlined">clear_all</span>
                            </button>
                        </td>
                        
                    </tr>
                </tbody>
                <tbody id="inventoryTableBody">
                    <!-- Inventory rows will be added here dynamically -->
                </tbody>
            </table>
        </div>
    `;

    let inventory = [];

    
    document.getElementById("searchButton").addEventListener("click", function() {
        const itemName = document.getElementById("itemName").value;
        const itemNo = document.getElementById("itemNo").value;
        const batchNo = document.getElementById("batchNo").value;
        const batchName = document.getElementById("batchName").value;
        const quantity = document.getElementById("quantity").value;
        const description = document.getElementById("description").value;

        console.log("Searching for:", {
            itemName,
            itemNo,
            batchNo,
            batchName,
            quantity,
            description,
        });

        
    });

    
    document.getElementById("clearButton").addEventListener("click", function() {
        document.getElementById("itemName").value = "";
        document.getElementById("itemNo").value = "";
        document.getElementById("batchNo").value = "";
        document.getElementById("batchName").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("description").value = "";
    });

    
    document.getElementById("saveButton").addEventListener("click", function() {
        const itemName = document.getElementById("itemName").value;
        const itemNo = document.getElementById("itemNo").value;
        const batchNo = document.getElementById("batchNo").value;
        const batchName = document.getElementById("batchName").value;
        const quantity = document.getElementById("quantity").value;
        const description = document.getElementById("description").value;

        
        if (!itemName || !itemNo || !batchNo || !batchName || !quantity || !description) {
            alert("All Fields Required!");
            return;
        }

        
        const newItem = {
            itemName,
            itemNo,
            batchNo,
            batchName,
            quantity: parseInt(quantity), 
            description
        };

        
        inventory.push(newItem);

        
        console.log("Saved Inventory:", inventory);

        
        document.getElementById("itemName").value = "";
        document.getElementById("itemNo").value = "";
        document.getElementById("batchNo").value = "";
        document.getElementById("batchName").value = "";
        document.getElementById("quantity").value = "";
        document.getElementById("description").value = "";

        
        updateInventoryTable();
    });

    
    function updateInventoryTable() {
        const tableBody = document.getElementById("inventoryTableBody");
        tableBody.innerHTML = ""; 

        
        inventory.forEach((item, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td></td>
                <td>${item.itemName}</td>
                <td>${item.itemNo}</td>
                <td>${item.batchNo}</td>
                <td>${item.batchName}</td>
                <td>${item.quantity}</td>
                <td>${item.description}</td>
                <td>
                    <button class= "deleteButton" data-index="${index}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                <td>
                <td></td>
            `;
            const deleteButton = row.querySelector(".deleteButton");
            deleteButton.addEventListener("click", function() {
                const indexToDelete = parseInt(deleteButton.getAttribute("data-index"));
                inventory.splice(indexToDelete, 1);  
                updateInventoryTable();  
            });

            tableBody.appendChild(row);
        });
    }
}
