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
