require('dotenv').config();

const mysql = require('mysql2');

const setting = {
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
};

console.log('Database connection settings:', {
  host: setting.host,
  user: setting.user,
  password: '*****', // Mask the password for security
  database: setting.database,
});

const pool = mysql.createPool(setting);

module.exports = pool;