const express = require("express");
const router = express.Router();
const db = require("../db/db");

// CREATE OUTLET
router.post("/create", (req, res) => {
  const { 
    business_id, name, name_in_arabic, Email, Phone, Whatsapp, 
    tax_registration_number, countryid, time_zoneid, currencyid, 
    languageid, samedaydelivery, nextdaydelivery, taxrate, isinclusive 
  } = req.body;

  const sql = `INSERT INTO business_outlet_details 
    (business_id, name, name_in_arabic, Email, Phone, Whatsapp, tax_registration_number, countryid, time_zoneid, currencyid, languageid, samedaydelivery, nextdaydelivery, taxrate, isinclusive) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
  const values = [
    business_id || 1, name, name_in_arabic, Email, Phone, Whatsapp, 
    tax_registration_number, countryid, time_zoneid, currencyid, 
    languageid, samedaydelivery || 0, nextdaydelivery || 0, taxrate, isinclusive || 0
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Outlet created", id: result.insertId });
  });
});

// GET ALL OUTLETS
router.get("/", (req, res) => {
  const business_id = req.query.business_id || 1;
  db.query("SELECT * FROM business_outlet_details WHERE business_id = ? ORDER BY id DESC", [business_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPDATE OUTLET
router.put("/update/:id", (req, res) => {
  const { 
    name, name_in_arabic, Email, Phone, Whatsapp, 
    tax_registration_number, countryid, time_zoneid, currencyid, 
    languageid, samedaydelivery, nextdaydelivery, taxrate, isinclusive 
  } = req.body;

  const sql = `UPDATE business_outlet_details SET 
    name=?, name_in_arabic=?, Email=?, Phone=?, Whatsapp=?, 
    tax_registration_number=?, countryid=?, time_zoneid=?, currencyid=?, 
    languageid=?, samedaydelivery=?, nextdaydelivery=?, taxrate=?, isinclusive=? 
    WHERE id=?`;
  
  const values = [
    name, name_in_arabic, Email, Phone, Whatsapp, tax_registration_number, 
    countryid, time_zoneid, currencyid, languageid, samedaydelivery, 
    nextdaydelivery, taxrate, isinclusive, req.params.id
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Outlet updated" });
  });
});

// DELETE OUTLET (Hard Delete - no isdeleted column)
router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM business_outlet_details WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Outlet permanently deleted" });
  });
});

module.exports = router;