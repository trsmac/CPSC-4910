-- Update the description column in the products table to allow longer text
ALTER TABLE products
MODIFY COLUMN description TEXT NOT NULL;
