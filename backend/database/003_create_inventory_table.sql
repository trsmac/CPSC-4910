-- Create the inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,     -- Unique identifier for each inventory record
    product_id INT,                                  -- Foreign key to the products table
    batch_number VARCHAR(100),                       -- Batch number of the product
    serial_number VARCHAR(100) UNIQUE,               -- Unique serial number for each product
    quantity INT DEFAULT 0,                          -- Quantity of products in stock
    location VARCHAR(255),                           -- Location of the product in the warehouse
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Last update timestamp
    FOREIGN KEY (product_id) REFERENCES products(product_id) -- Foreign key relationship with products
);
