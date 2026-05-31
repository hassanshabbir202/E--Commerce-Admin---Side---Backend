// db\db.js
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "testdb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, conn)=>{
  if(err){
    console.error("DB Connection error:", err.message);
  }else{
    console.log("MySQL Pool Connected Succesfully!");
    conn.release();
  }
});

// db.connect((err) => {
//   if (err) {
//     console.log("DB connection error:", err);
//   } else {
//     console.log("MySQL Connected");
//   }
// });

module.exports = db;
