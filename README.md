# Trackalytics - Django Web Application

Trackalytics is a Django-based web application that helps you manage inventory, track activities, and view products. This guide provides instructions on how to set up and run the project on Windows, macOS, and Ubuntu Linux.

## Prerequisites

Before you can run this project, make sure you have the following installed:

- **Python** (>= 3.8)
- **pip** (Python package manager)
- **Django** (>= 3.x)
- **SQLite** (pre-installed with Python)

You will also need a code editor (e.g., Visual Studio Code, PyCharm) and access to a terminal or command prompt.

## Installation Steps

### GitHub Codespace (Ubuntu)

1. **Install Django and ReportLab**

   ```bash
   pip install django
   pip install reportlab
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd trackalytics
   ```

3. **Run Migrations**

   Create migration files based on project models
   ```bash
   python manage.py makemigrations
   ```
   
   Apply the migrations to the database
   ```
   python manage.py migrate
   ```

4. Verify the Migration

   Open the SQLite shell
   ```bash
   sqlite3 db.sqlite3
   ```

   List the tables
   ```sql
   .tables
   ```

   View Table Structure
   ```sql
   PRAGMA table_info(table_name);
   ```
   
   View overview of all tables and their creation SQL:
   ```sql
   SELECT sql FROM sqlite_master WHERE type='table' AND name='table_name';
   ```

   Describe a table
   ```sql
   .schema table_name
   ```

   Exit SQL shell
   ```sql
   .exit
   ```

5. Run the Server

   ```bash
   python manage.py runserver
   ```
---