//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const pool = require("./services/db");

//////////////////////////////////////////////////////
// DEFINE SQL STATEMENTS
//////////////////////////////////////////////////////
const SQLSTATEMENT = `
SELECT * FROM products;
SELECT * FROM inventory;
SELECT * FROM inventory_history;
SELECT * FROM roles;
SELECT * FROM permissions;
SELECT * FROM users;
SELECT * FROM activity_logs;
SELECT * FROM report_exports;
`;

//////////////////////////////////////////////////////
// RUN SQL STATEMENTS
//////////////////////////////////////////////////////
pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error reading tables:", error);
  } else {
    console.log("Results from products:", results[0]);
    console.log("Results from inventory:", results[1]);
    console.log("Results from inventory_history:", results[2]);
    console.log("Results from roles:", results[3]);
    console.log("Results from permissions:", results[4]);
    console.log("Results from users:", results[5]);
    console.log("Results from activity_logs:", results[6]);
    console.log("Results from report_exports:", results[7]);
  }
  process.exit();
});