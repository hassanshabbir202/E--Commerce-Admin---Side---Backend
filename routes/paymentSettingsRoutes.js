const express = require("express");
const router = express.Router();
const db = require("../db/db");

// ADD PAYMENT GATEWAY CONFIG
router.post("/create", (req, res) => {
  const { business_id, payment_gateway_id, public_key, privste_key, isactive } = req.body;

  const sql = `INSERT INTO payment_gateway_setting_details (business_id, payment_gateway_id, public_key, privste_key, created_datetime, isactive) VALUES (?, ?, ?, ?, NOW(), ?)`;
  db.query(sql, [business_id || 1, payment_gateway_id, public_key, privste_key, isactive || 1], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Payment Gateway configured", id: result.insertId });
  });
});

// GET ALL SETTINGS FOR A BUSINESS
router.get("/", (req, res) => {
  const business_id = req.query.business_id || 1;
  db.query("SELECT id, payment_gateway_id, isactive FROM payment_gateway_setting_details WHERE business_id = ?", [business_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPDATE GATEWAY
router.put("/update/:id", (req, res) => {
  const { public_key, privste_key, isactive } = req.body;
  
  const sql = `UPDATE payment_gateway_setting_details SET public_key=?, privste_key=?, isactive=? WHERE id=?`;
  db.query(sql, [public_key, privste_key, isactive, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Payment Gateway updated" });
  });
});

// DELETE GATEWAY
router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM payment_gateway_setting_details WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Payment Gateway deleted" });
  });
});

module.exports = router;