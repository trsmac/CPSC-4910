-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for each product
    product_name VARCHAR(255) NOT NULL,               -- Name of the product
    description TEXT,                                -- Description of the product
    category VARCHAR(100),                           -- Category of the product
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,   -- Timestamp of when the product was created
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp of the last update
);
