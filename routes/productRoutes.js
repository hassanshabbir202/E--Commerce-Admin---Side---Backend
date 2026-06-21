// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");

// 1. IMPORT THE QUERIES DICTIONARY
const { productQueries } = require("../db/queries");

// CREATE PRODUCT
router.post("/create", (req, res) => {
  const { name, shortdescription, longdescription, brandid, saleprice, Isaddon, isinventory, sku, costprice, sortorder, business_id } = req.body;

  const values = [name, shortdescription, longdescription, brandid, saleprice, Isaddon || 0, isinventory || 1, sku, costprice, sortorder || 0, business_id || 1];

  // 2. USE THE DICTIONARY
  db.query(productQueries.create, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Product created", id: result.insertId });
  });
});

// GET ALL PRODUCTS
router.get("/", (req, res) => {
  const business_id = req.query.business_id || 1;
  
  // 2. USE THE DICTIONARY
  db.query(productQueries.getAll, [business_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPDATE PRODUCT
router.put("/update/:id", (req, res) => {
  const { name, shortdescription, longdescription, brandid, saleprice, Isaddon, isinventory, sku, costprice, sortorder } = req.body;
  
  const values = [name, shortdescription, longdescription, brandid, saleprice, Isaddon, isinventory, sku, costprice, sortorder, req.params.id];

  // 2. USE THE DICTIONARY
  db.query(productQueries.update, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product updated" });
  });
});

// DELETE PRODUCT
router.delete("/delete/:id", (req, res) => {
  // 2. USE THE DICTIONARY
  db.query(productQueries.softDelete, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted" });
  });
});

module.exports = router;