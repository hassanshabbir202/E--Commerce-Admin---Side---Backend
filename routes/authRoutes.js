// F:\E--Commerce-Admin\routes\authRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // 🛑 STOP: YOU MUST CHANGE "application_users_table" TO THE REAL TABLE NAME!
  const sql = `
    SELECT 
      u.*, 
      bs.business_name, 
      bs.display_name, 
      bs.time_zone,
      bod.name AS outlet_name,
      bod.currencyid
    FROM application_users_table u 
    JOIN business_setting bs ON u.business_id = bs.id
    LEFT JOIN business_outlet_details bod ON bs.id = bod.business_id
    WHERE u.email = ? AND u.password = ?
  `;

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Login successful! Send back the global session object
    res.json({
      message: "Login successful",
      session: results[0] 
    });
  });
});

module.exports = router;