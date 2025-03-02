//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const pool = require("../services/db");

//////////////////////////////////////////////////////
// DEFINE SQL STATEMENTS
//////////////////////////////////////////////////////
const SQLSTATEMENT = `
DROP TABLE IF EXISTS inventory_history;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS report_exports;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS kpis;
DROP TABLE IF EXISTS products;

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    batch_number VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    quantity INT DEFAULT 0,
    location VARCHAR(255),
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE IF NOT EXISTS inventory_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT,
    action ENUM('received', 'sold', 'damaged', 'adjustment') NOT NULL,
    quantity INT,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(inventory_id)
);

CREATE TABLE IF NOT EXISTS roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    permission_name VARCHAR(100),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE IF NOT EXISTS activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS report_exports (
    export_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    file_format ENUM('CSV', 'PDF', 'Excel') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO products (product_name, description, category) VALUES
  ('Product A', 'Description for Product A', 'Category 1'),
  ('Product B', 'Description for Product B', 'Category 2'),
  ('Product C', 'Description for Product C', 'Category 3');

INSERT INTO inventory (product_id, batch_number, serial_number, quantity, location) VALUES
  (1, 'Batch001', 'SN001', 100, 'Warehouse A'),
  (2, 'Batch002', 'SN002', 200, 'Warehouse B'),
  (3, 'Batch003', 'SN003', 150, 'Warehouse C');

INSERT INTO inventory_history (inventory_id, action, quantity) VALUES
  (1, 'received', 100),
  (2, 'sold', 50),
  (3, 'damaged', 10);

INSERT INTO roles (role_name) VALUES
  ('Admin'),
  ('Manager'),
  ('User');

INSERT INTO permissions (role_id, permission_name) VALUES
  (1, 'view_inventory'),
  (1, 'edit_inventory'),
  (2, 'view_inventory'),
  (3, 'view_inventory');

INSERT INTO users (username, email, password_hash, role_id) VALUES
  ('admin', 'admin@example.com', 'hashed_password_1', 1),
  ('manager', 'manager@example.com', 'hashed_password_2', 2),
  ('user', 'user@example.com', 'hashed_password_3', 3);

INSERT INTO activity_logs (user_id, action) VALUES
  (1, 'Logged in'),
  (2, 'Viewed inventory'),
  (3, 'Logged out');

INSERT INTO report_exports (user_id, file_format, file_name) VALUES
  (1, 'CSV', 'inventory_report.csv'),
  (2, 'PDF', 'sales_report.pdf');
`;

//////////////////////////////////////////////////////
// RUN SQL STATEMENTS
//////////////////////////////////////////////////////
pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");

    // Example query to test the new tables
    pool.query('SELECT * FROM products;', (error, results, fields) => {
      if (error) {
        console.error("Error reading tables:", error);
      } else {
        console.log("Products:", results);
      }
      process.exit();
    });
  }
});