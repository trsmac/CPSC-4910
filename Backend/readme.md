# Database Setup and Initialization Guide

This guide explains the process of setting up the MySQL database, connecting to it, and testing the connection for the project. Follow these steps to ensure that the database is running properly and the necessary tables are initialized.

---

## 1. **Navigate to the Backend Directory**

Make sure you're in the `backend` directory of the project to execute the necessary commands:

```bash
cd backend
```

---

## 2. **Run the Initialization Command (First Attempt)**

Try running the `npm run init_tables` command to initialize the database tables. If the following error occurs, it typically indicates that the MySQL connection is not available:

```bash
npm run init_tables
```

**Error**: `ECONNREFUSED` - This means that the MySQL database connection was refused, likely because the database is not running.

---

## 3. **Check Running Docker Containers**

Check if any Docker containers are currently running. This is useful to verify that MySQL is not already running:

```bash
docker ps
```

If no containers are running, proceed to the next step to start a new MySQL container.

---

## 4. **Run MySQL Docker Container**

Run a new MySQL Docker container, specifying the root password and mapping the MySQL port (`3306`) to the host:

```bash
docker run --name root -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:latest
```

If you receive an error indicating that the container name `root` is already in use, stop and remove the existing container before retrying:

```bash
docker stop <container_id>
docker rm <container_id>
```

Then, re-run the MySQL container with the command above.

---

## 5. **Verify MySQL Container is Running**

Ensure that the MySQL container is up and running:

```bash
docker ps
```

This should show a list of running containers, including your MySQL container.

---

## 6. **Connect to MySQL Database Inside the Container**

To connect to MySQL inside the Docker container, run the following command:

```bash
docker exec -it <container_id> bash
mysql -u root -p
```

When prompted, enter the password `password` to access the MySQL monitor.

---

## 7. **Create and Test the Database**

Once inside the MySQL monitor, ensure that the `db_trackalytics` database exists and that you can list the tables:

```sql
USE db_trackalytics;
SHOW TABLES;
```

---

## 8. **Run the Initialization Command Again**

Now that MySQL is up and running, try running the initialization command again to set up the tables:

```bash
npm run init_tables
```

You should see output indicating that the database `db_trackalytics` has been created and tables such as `products`, `activity_logs`, `users`, etc., have been successfully created.

Example output:

```
Database "db_trackalytics" does not exists
Database "db_trackalytics" has been created successfully
Tables created successfully
```

---

## 9. **Verify Tables in MySQL**

You can further confirm that the tables have been created by listing them within the MySQL monitor:

```sql
SHOW TABLES;
```

Expected output:

```sql
+---------------------------+
| Tables_in_db_trackalytics |
+---------------------------+
| activity_logs             |
| inventory                 |
| inventory_history         |
| permissions               |
| products                  |
| report_exports            |
| roles                     |
| users                     |
+---------------------------+
```

---

## 10. **Exit MySQL and Docker**

Once you're done, exit both the MySQL monitor and the Docker container:

```bash
EXIT  # To exit MySQL
exit  # To exit the Docker container
```

---

## Key Points to Ensure Proper Connection:

- **Ensure MySQL Container is Running**: If the MySQL Docker container isn't running, the connection will be refused.
- **Check Connection Parameters**: Verify that the database connection parameters in your project configuration files (host, port, username, password) are correct.
- **Confirm Database and Tables**: After running the `init_tables` command, verify that the database and tables have been created by using the `SHOW TABLES` command in MySQL.

---

If you encounter any issues during this process, feel free to reach out for assistance.