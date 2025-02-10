-- Create the report exports table
CREATE TABLE IF NOT EXISTS report_exports (
    export_id INT AUTO_INCREMENT PRIMARY KEY,        -- Unique identifier for each export
    user_id INT,                                     -- Foreign key to the users table
    file_format ENUM('CSV', 'PDF', 'Excel') NOT NULL, -- Format of the exported file
    file_name VARCHAR(255) NOT NULL,                  -- Name of the exported file
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the export was generated
    FOREIGN KEY (user_id) REFERENCES users(user_id)  -- Foreign key relationship with users
);
