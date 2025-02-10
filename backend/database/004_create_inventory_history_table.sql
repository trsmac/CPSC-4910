-- Create the inventory history table
CREATE TABLE IF NOT EXISTS inventory_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for each history record
    inventory_id INT,                                -- Foreign key to the inventory table
    action ENUM('received', 'sold', 'damaged', 'adjustment') NOT NULL,  -- Action type (received, sold, etc.)
    quantity INT,                                    -- Quantity affected by the action
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the transaction
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) -- Foreign key relationship with inventory
);
