-- Create the database for Trackalytics
CREATE DATABASE IF NOT EXISTS trackalytics;

-- Use the Trackalytics database
USE trackalytics;

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for each product
    product_name VARCHAR(255) NOT NULL,               -- Name of the product
    description TEXT,                                -- Description of the product
    category VARCHAR(100),                           -- Category of the product
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,   -- Timestamp of when the product was created
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp of the last update
);

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

-- Create the inventory history table
CREATE TABLE IF NOT EXISTS inventory_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for each history record
    inventory_id INT,                                -- Foreign key to the inventory table
    action ENUM('received', 'sold', 'damaged', 'adjustment') NOT NULL,  -- Action type (received, sold, etc.)
    quantity INT,                                    -- Quantity affected by the action
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Timestamp of the transaction
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id) -- Foreign key relationship with inventory
);

-- Create the roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,          -- Unique identifier for each role
    role_name VARCHAR(50) UNIQUE NOT NULL             -- Name of the role (e.g., Admin, Manager)
);

-- Create the permissions table
CREATE TABLE IF NOT EXISTS permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,    -- Unique identifier for each permission
    role_id INT,                                     -- Foreign key to the roles table
    permission_name VARCHAR(100),                     -- Name of the permission (e.g., 'view_inventory', 'edit_roles')
    FOREIGN KEY (role_id) REFERENCES roles(role_id)   -- Foreign key relationship with roles
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,          -- Unique identifier for each user
    username VARCHAR(50) UNIQUE NOT NULL,             -- Username for the user
    email VARCHAR(100) UNIQUE NOT NULL,               -- Email address for the user
    password_hash TEXT NOT NULL,                      -- Hashed password for the user
    role_id INT,                                      -- Foreign key to the roles table
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,    -- Timestamp of when the user was created
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp of last update
    FOREIGN KEY (role_id) REFERENCES roles(role_id)   -- Foreign key relationship with roles
);

-- Create the activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,           -- Unique identifier for each log entry
    user_id INT,                                     -- Foreign key to the users table
    action VARCHAR(255),                              -- Description of the user action
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,     -- Timestamp of the action
    FOREIGN KEY (user_id) REFERENCES users(user_id)  -- Foreign key relationship with users
);

-- Create the kpis table
CREATE TABLE IF NOT EXISTS kpis (
    kpi_id INT AUTO_INCREMENT PRIMARY KEY,           -- Unique identifier for each KPI
    kpi_name VARCHAR(255) NOT NULL,                   -- Name of the KPI (e.g., Stock Turnover Rate)
    value DECIMAL(15, 2) NOT NULL,                    -- Value of the KPI
    time_period DATE NOT NULL,                        -- Time period for the KPI (e.g., monthly, yearly)
    category VARCHAR(100),                            -- Category of the KPI (e.g., Inventory, Sales)
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Last updated timestamp
);

-- Create the report exports table
CREATE TABLE IF NOT EXISTS report_exports (
    export_id INT AUTO_INCREMENT PRIMARY KEY,        -- Unique identifier for each export
    user_id INT,                                     -- Foreign key to the users table
    file_format ENUM('CSV', 'PDF', 'Excel') NOT NULL, -- Format of the exported file
    file_name VARCHAR(255) NOT NULL,                  -- Name of the exported file
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the export was generated
    FOREIGN KEY (user_id) REFERENCES users(user_id)  -- Foreign key relationship with users
);

