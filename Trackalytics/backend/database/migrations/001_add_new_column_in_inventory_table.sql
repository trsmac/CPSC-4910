-- Add a new column 'last_checked' to the inventory table
ALTER TABLE inventory
ADD COLUMN last_checked DATETIME DEFAULT CURRENT_TIMESTAMP;
