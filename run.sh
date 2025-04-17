#!/bin/bash

# Header
echo "=============================================="
echo "      🚀 Trackalytics Setup Script 🌟"
echo "=============================================="
echo ""

# Navigate to Django project directory
cd /workspaces/CPSC-4910/trackalytics_project || {
  echo -e "\033[1;31m❌ Directory not found: /workspaces/CPSC-4910/trackalytics_project\033[0m"
  exit 1
}

# Install Django
echo -e "\033[1;34m📦 Installing Django and dependencies...\033[0m"
pip install django || {
  echo -e "\033[1;31m❌ Failed to install Django.\033[0m"
  exit 1
}
echo "✅ Django installed."
echo "========================================="

# Clean old DB and migrations
echo -e "\033[1;31m🧹 Resetting database and clearing old migrations...\033[0m"
rm -f db.sqlite3

APP_DIR="./trackalytics"
MIGRATIONS_DIR="$APP_DIR/migrations"

if [ -d "$MIGRATIONS_DIR" ]; then
  find "$MIGRATIONS_DIR" -type f -name "*.py" ! -name "__init__.py" -delete
  find "$MIGRATIONS_DIR" -type f -name "*.pyc" -delete
else
  mkdir "$MIGRATIONS_DIR"
  touch "$MIGRATIONS_DIR/__init__.py"
fi

echo "✅ Database and migration files cleaned."
echo "========================================="

# Run migrations
echo -e "\033[1;32m⚙️ Creating and applying migrations...\033[0m"
python manage.py makemigrations trackalytics
python manage.py migrate
echo "✅ Migrations complete."
echo "========================================="

# Prompt user to create superuser
echo -e "\033[1;36m🔐 Creating Django superuser (you will be prompted)...\033[0m"
python manage.py createsuperuser
echo "✅ Superuser created."
echo "========================================="

# Verify DB tables
echo -e "\033[1;36m🔍 Verifying database tables...\033[0m"
python <<EOF
import sqlite3
try:
    conn = sqlite3.connect("db.sqlite3")
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    if not tables:
        print("❌ No tables found.")
    else:
        print("✅ Tables found:")
        for table in tables:
            print(f"\n📌 {table[0]}")
            cursor.execute(f"PRAGMA table_info({table[0]});")
            for col in cursor.fetchall():
                print(f"  🔹 {col[1]} ({col[2]})")
    conn.close()
except Exception as e:
    print(f"❌ Error checking tables: {e}")
EOF
echo "========================================="

# Start server
echo -e "\033[1;35m🚀 Starting Django dev server...\033[0m"
python manage.py runserver 0.0.0.0:8000
echo "🎉 Server closed at http://localhost:8000"
echo "=============================================="