-- Create the activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,           -- Unique identifier for each log entry
    user_id INT,                                     -- Foreign key to the users table
    action VARCHAR(255),                              -- Description of the user action
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,     -- Timestamp of the action
    FOREIGN KEY (user_id) REFERENCES users(user_id)  -- Foreign key relationship with users
);
