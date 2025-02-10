-- Seed sample users into the users table
INSERT INTO users (username, email, password_hash, role_id)
VALUES
('admin', 'admin@example.com', 'hashedpassword123', 1),
('manager', 'manager@example.com', 'hashedpassword123', 2),
('user', 'user@example.com', 'hashedpassword123', 3);
