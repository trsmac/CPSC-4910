const pool = require('./src/services/db.js');

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the database!');
  connection.release(); // Release the connection back to the pool
});