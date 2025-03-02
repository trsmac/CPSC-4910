//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const mysql = require("mysql2"); // Directly use mysql2
const pool = require("../services/db");

//////////////////////////////////////////////////////
// GET DATABASE NAME FROM POOL CONFIG
//////////////////////////////////////////////////////
const database = pool.config.connectionConfig.database;

//////////////////////////////////////////////////////
// CREATE A TEMPORARY CONNECTION WITHOUT A DATABASE
//////////////////////////////////////////////////////
const tempConnection = mysql.createConnection({
  host: pool.config.connectionConfig.host,
  user: pool.config.connectionConfig.user,
  password: pool.config.connectionConfig.password,
});

//////////////////////////////////////////////////////
// DEFINE SQL STATEMENTS
//////////////////////////////////////////////////////
const CHECK_DB_SQL = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`;
const CREATE_DB_SQL = `CREATE DATABASE IF NOT EXISTS \`${database}\``;

//////////////////////////////////////////////////////
// RUN SQL STATEMENTS
//////////////////////////////////////////////////////
// Check if the database exists
tempConnection.query(CHECK_DB_SQL, [database], (error, results) => {
  if (error) {
    console.error("Error checking database:", error);
    tempConnection.end(); // Close connection properly
    return;
  }

  if (results.length === 0) {
    console.log(`Database "${database}" does not exist. Creating...`);
    tempConnection.query(CREATE_DB_SQL, (error) => {
      if (error) {
        console.error("Error creating database:", error);
      } else {
        console.log(`Database "${database}" has been created successfully`);
      }
      tempConnection.end(); // Close connection after operation
      process.exit();
    });
  } else {
    console.log(`Database "${database}" already exists`);
    tempConnection.end(); // Close connection
    process.exit();
  }
});
