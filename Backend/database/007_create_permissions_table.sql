-- Create the permissions table
CREATE TABLE IF NOT EXISTS permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,    -- Unique identifier for each permission
    role_id INT,                                     -- Foreign key to the roles table
    permission_name VARCHAR(100),                     -- Name of the permission (e.g., 'view_inventory', 'edit_roles')
    FOREIGN KEY (role_id) REFERENCES roles(role_id)   -- Foreign key relationship with roles
);
