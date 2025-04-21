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

# Install dependencies
echo -e "\033[1;34m📦 Installing Dependencies...\033[0m"
pip install -r requirements.txt || {
  echo -e "\033[1;31m❌ Failed to install dependencies.\033[0m"
  exit 1
}
echo "✅ Dependencies installed."
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
  mkdir -p "$MIGRATIONS_DIR"
  touch "$MIGRATIONS_DIR/__init__.py"
fi

echo "✅ Database and migration files cleaned."
echo "========================================="

# Run migrations
echo -e "\033[1;32m⚙️ Creating and applying migrations...\033[0m"
python manage.py makemigrations
python manage.py migrate
echo "✅ Migrations complete."
echo "========================================="


# Create superuser automatically
echo -e "\033[1;36m🔐 Creating Django superuser (auto)...\033[0m"
python <<EOF
import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "trackalytics_project.settings")
django.setup()

from trackalytics.models import CustomUser

email = "admin@admin.com"
password = "adminpass"

if not CustomUser.objects.filter(email=email).exists():
    CustomUser.objects.create_superuser(email=email, password=password)
    print(f"✅ Superuser created: {email}")
else:
    print(f"⚠️ Superuser already exists: {email}")
EOF
echo "========================================="

# Verify DB
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

# Start ASGI server with Daphne
echo -e "\033[1;35m🚀 Starting ASGI server with Daphne...\033[0m"
daphne -b 0.0.0.0 -p 8000 trackalytics_project.asgi:application
echo "🎉 Server running at http://localhost:8000"
echo "=============================================="
