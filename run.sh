#!/bin/bash

# Header with title
echo "=============================================="
echo "      🚀 Trackalytics Setup Script 🌟"
echo "=============================================="
echo ""

# Install dependencies
echo -e "\033[1;34m📦 Installing Django...\033[0m"
pip install django
echo "✅ Django installed."
pip freeze > requirements.txt
echo "✅ Requirements file updated."
echo "========================================="  # Divider

# Navigate to the project directory
echo -e "\033[1;33m📂 Navigating to project directory...\033[0m"
cd trackalytics_project || { echo -e "\033[1;31m❌ Directory 'trackalytics_project' not found!\033[0m"; exit 1; }
echo "✅ In project directory."
echo "========================================="  # Divider

# Step 2: Full DB & migration reset
echo -e "\033[1;31m🧹 Resetting database and migrations...\033[0m"
rm -f db.sqlite3
find ../trackalytics -path "*/migrations/*.py" -not -name "__init__.py" -delete
find ../trackalytics -path "*/migrations/*.pyc" -delete
mkdir -p ../trackalytics/migrations
touch ../trackalytics/migrations/__init__.py
echo "✅ Database and migration files cleaned."
echo "========================================="  # Divider

# Step 3: Run migrations
echo -e "\033[1;32m⚙️ Creating and applying migrations...\033[0m"
python manage.py makemigrations
python manage.py migrate
echo "✅ Migrations created and applied."
echo "========================================="  # Divider

# Step 4: Verify migrations by displaying tables
echo -e "\033[1;36m🔍 Verifying database tables...\033[0m"
python <<EOF
import sqlite3

db_path = "db.sqlite3"
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    if not tables:
        print("❌ No tables found in the database.")
    else:
        print("\n✅ Tables in the database:")
        for table in tables:
            table_name = table[0]
            print(f"\n📌 Table: {table_name}")

            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()

            for col in columns:
                print(f"  🔹 Column: {col[1]}, Type: {col[2]}, Not Null: {col[3]}, Default: {col[4]}, Primary Key: {col[5]}")

    conn.close()
except Exception as e:
    print(f"❌ Error: {e}")
EOF
echo "========================================="  # Divider

# Step 5: Run the Django development server
echo -e "\033[1;35m🚀 Starting Django development server...\033[0m"
python manage.py runserver
echo "========================================="  # Divider

# Footer with completion message
echo "=============================================="
echo "🎉 Application Successfully Closed! 🎉"
echo "=============================================="
