#!/bin/bash

echo "🚀 Setting up Trackalytics project..."

# Step 1: Install dependencies
echo "📦 Installing Django and ReportLab..."
pip install django reportlab

# Step 2: Navigate to the project directory
echo "📂 Navigating to project directory..."
cd trackalytics || { echo "❌ Directory 'trackalytics' not found!"; exit 1; }

# Step 3: Run migrations
echo "⚙️ Running migrations..."
python manage.py makemigrations
python manage.py migrate

# Step 4: Verify migrations by displaying tables
echo "🔍 Verifying database tables..."
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

# Step 5: Run the Django development server
echo "🚀 Starting Django development server..."
python manage.py runserver

echo "✅ Setup complete! 🎉"
