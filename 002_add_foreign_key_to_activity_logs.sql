-- Add a foreign key constraint to the activity_logs table linking to the users table
ALTER TABLE activity_logs
ADD CONSTRAINT FK_activity_logs_users
FOREIGN KEY (user_id) REFERENCES users(user_id);
