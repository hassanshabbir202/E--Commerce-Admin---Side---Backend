// routes/outletRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");

// 1. IMPORT THE QUERIES DICTIONARY
const { outletQueries } = require("../db/queries");

// CREATE OUTLET
router.post("/create", (req, res) => {
  const { 
    business_id, name, name_in_arabic, Email, Phone, Whatsapp, 
    tax_registration_number, countryid, time_zoneid, currencyid, 
    languageid, samedaydelivery, nextdaydelivery, taxrate, isinclusive 
  } = req.body;
    
  const values = [
    business_id || 1, name, name_in_arabic, Email, Phone, Whatsapp, 
    tax_registration_number, countryid, time_zoneid, currencyid, 
    languageid, samedaydelivery || 0, nextdaydelivery || 0, taxrate, isinclusive || 0
  ];

  // 2. USE THE DICTIONARY
  db.query(outletQueries.create, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Outlet created", id: result.insertId });
  });
});

// GET ALL OUTLETS
router.get("/", (req, res) => {
  const business_id = req.query.business_id || 1;

  // 2. USE THE DICTIONARY
  db.query(outletQueries.getAll, [business_id], (err, results) => {
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
  
  const values = [
    name, name_in_arabic, Email, Phone, Whatsapp, tax_registration_number, 
    countryid, time_zoneid, currencyid, languageid, samedaydelivery, 
    nextdaydelivery, taxrate, isinclusive, req.params.id
  ];

  // 2. USE THE DICTIONARY
  db.query(outletQueries.update, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Outlet updated" });
  });
});

// DELETE OUTLET (Hard Delete)
router.delete("/delete/:id", (req, res) => {
  // 2. USE THE DICTIONARY
  db.query(outletQueries.hardDelete, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Outlet permanently deleted" });
  });
});

module.exports = router;