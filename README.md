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

Follow these steps depending on your operating system.

---

### Windows

1. **Install Python**
   - Download the latest Python version from the official Python website.
   - During installation, make sure to check the option **"Add Python to PATH"**.

2. **Install pip**
   - `pip` should come with Python. To verify, open Command Prompt and run:
     ```bash
     pip --version
     ```

3. **Clone the Project Repository**
   - Open Command Prompt and run the following command to clone the project from GitHub:
     ```bash
     git clone <repository-url>
     ```

4. **Navigate to the Project Directory**
   - Change to the project folder:
     ```bash
     cd trackalytics
     ```

5. **Install Dependencies**
   - Install the required Python packages:
     ```bash
     pip install -r requirements.txt
     ```

6. **Run the Development Server**
   - After installing the dependencies, you can run the Django development server:
     ```bash
     python manage.py runserver
     ```

7. **Access the App**
   - Open your browser and go to `http://localhost:8000` to view the app.

8. **View the Database**
   - To view your SQLite database, you can use the `sqlite3` command-line tool. Open Command Prompt and run:
     ```bash
     sqlite3 db.sqlite3
     ```
   - Once inside the SQLite shell, you can execute SQL commands to view your data. For example, to view all tables, run:
     ```sql
     .tables
     ```

---

### macOS

1. **Install Python**
   - macOS usually comes with Python pre-installed. To verify, open Terminal and run:
     ```bash
     python3 --version
     ```

2. **Install pip**
   - If pip is not installed, you can install it using:
     ```bash
     sudo easy_install pip
     ```

3. **Clone the Project Repository**
   - Open Terminal and run the following command to clone the project from GitHub:
     ```bash
     git clone <repository-url>
     ```

4. **Navigate to the Project Directory**
   - Change to the project folder:
     ```bash
     cd trackalytics
     ```

5. **Install Dependencies**
   - Install the required Python packages:
     ```bash
     pip3 install -r requirements.txt
     ```

6. **Run the Development Server**
   - After installing the dependencies, you can run the Django development server:
     ```bash
     python3 manage.py runserver
     ```

7. **Access the App**
   - Open your browser and go to `http://localhost:8000` to view the app.

8. **View the Database**
   - To view your SQLite database, you can use the `sqlite3` command-line tool. Open Terminal and run:
     ```bash
     sqlite3 db.sqlite3
     ```
   - Once inside the SQLite shell, you can execute SQL commands to view your data. For example, to view all tables, run:
     ```sql
     .tables
     ```

---

### Ubuntu Linux

1. **Install Python**
   - Ubuntu should come with Python pre-installed. Verify it by running:
     ```bash
     python3 --version
     ```

2. **Install pip**
   - If pip is not installed, you can install it by running:
     ```bash
     sudo apt update
     sudo apt install python3-pip
     ```

3. **Clone the Project Repository**
   - Open a terminal and run the following command to clone the project from GitHub:
     ```bash
     git clone <repository-url>
     ```

4. **Navigate to the Project Directory**
   - Change to the project folder:
     ```bash
     cd trackalytics
     ```

5. **Install Dependencies**
   - Install the required Python packages:
     ```bash
     pip3 install -r requirements.txt
     ```

6. **Run the Development Server**
   - After installing the dependencies, you can run the Django development server:
     ```bash
     python3 manage.py runserver
     ```

7. **Access the App**
   - Open your browser and go to `http://localhost:8000` to view the app.

8. **View the Database**
   - To view your SQLite database, you can use the `sqlite3` command-line tool. Open Terminal and run:
     ```bash
     sqlite3 db.sqlite3
     ```
   - Once inside the SQLite shell, you can execute SQL commands to view your data. For example, to view all tables, run:
     ```sql
     .tables
     ```

---

## Additional Information

### Database Setup

This project uses SQLite by default, which comes pre-configured with Django. However, if you need to change the database or set up another one (e.g., MySQL), you can modify the settings in the `settings.py` file.

To create the necessary database tables and migrate the models, run:
```bash
python manage.py migrate
