// routes/paymentSettingsRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");

// 1. IMPORT THE QUERIES DICTIONARY
const { paymentSettingsQueries } = require("../db/queries");

// ADD PAYMENT GATEWAY CONFIG
router.post("/create", (req, res) => {
  const { business_id, payment_gateway_id, public_key, privste_key, isactive } = req.body;

  const values = [business_id || 1, payment_gateway_id, public_key, privste_key, isactive || 1];

  // 2. USE THE DICTIONARY
  db.query(paymentSettingsQueries.create, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Payment Gateway configured", id: result.insertId });
  });
});

// GET ALL SETTINGS FOR A BUSINESS
router.get("/", (req, res) => {
  const business_id = req.query.business_id || 1;

  // 2. USE THE DICTIONARY
  db.query(paymentSettingsQueries.getAll, [business_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPDATE GATEWAY
router.put("/update/:id", (req, res) => {
  const { public_key, privste_key, isactive } = req.body;
  const values = [public_key, privste_key, isactive, req.params.id];
  
  // 2. USE THE DICTIONARY
  db.query(paymentSettingsQueries.update, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Payment Gateway updated" });
  });
});

// DELETE GATEWAY
router.delete("/delete/:id", (req, res) => {
  // 2. USE THE DICTIONARY
  db.query(paymentSettingsQueries.hardDelete, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Payment Gateway deleted" });
  });
});

module.exports = router;