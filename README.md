# Trackalytics - Django Web Application 

Trackalytics is a Django-based web application designed to manage inventory, track activities, and view products. This guide will show you how to set up and run the project using **GitHub Codespaces** (Ubuntu environment).

**Table of Contents**

1. [Installation and Setup Steps](#installation-and-setup-steps-using-github-codespaces-ubuntu)
2. [Project Structure](#project-structure)
3. [Testing](#testing)

## Installation and Setup Steps using GitHub Codespaces (Ubuntu)

### Step 1: Open GitHub Codespace

1. Navigate to your GitHub repository where **Trackalytics** is hosted.
2. Click the green "Code" button, then select "Open with Codespaces" to open a new or existing Codespace.

### Step 2: Run the Setup Script

Once your Codespace is up and running, execute the following commands in the terminal within the Codespace environment to set up your project:

**Make the setup script executable**

   ```bash
   chmod +x setup_project.sh
   ```

**Run the setup script**

   ```bash
   ./setup_project.sh
   ```

### Step 3: Access the Application

Once the setup script finishes running, you can access the Trackalytics web application by visiting:
```
http://127.0.0.1:8000/
```

## Project Structure

Here is an overview of the key files and directories in the project:

- `trackalytics/` - Main project directory containing settings and configurations.
- `trackalytics/app1/` - Django app where the core business logic resides (models, views, etc.).
- `trackalytics/static/` - Static files (CSS, JavaScript, and images) used throughout the application.
- `trackalytics/templates/` - HTML templates for rendering web pages.
- `trackalytics/db.sqlite3` - SQLite database file (default).
- `trackalytics/setup_project.sh` - A shell script that automates the setup process, including making the necessary files executable, installing dependencies, and running the setup steps to prepare the project for use.

## Testing

To run the tests for this project:

Run tests using Django's test framework:

```bash
python manage.py test
```
