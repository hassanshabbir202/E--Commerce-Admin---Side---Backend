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

db.getConnection((err, conn) => {
  if (err) {
    console.error("❌ DB Connection error:", err.message);
    console.error("🔍 Attempting to connect to host:", process.env.DB_HOST);
  } else {
    console.log("✅ MySQL Pool Connected Successfully!");
    console.log("🚀 Connected to DB:", process.env.DB_NAME, "at", process.env.DB_HOST);
    conn.release();
  }
});

module.exports = db;
