const express = require("express");
const router = express.Router();
const db = require("../db/db");

// CREATE PRODUCT
router.post("/create", (req, res) => {
  const { name, shortdescription, longdescription, brandid, saleprice, Isaddon, isinventory, sku, costprice, sortorder, business_id } = req.body;

  const sql = `INSERT INTO product (name, shortdescription, longdescription, brandid, saleprice, Isaddon, isinventory, sku, costprice, sortorder, business_id, createddatetime, isdeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`;
  const values = [name, shortdescription, longdescription, brandid, saleprice, Isaddon || 0, isinventory || 1, sku, costprice, sortorder || 0, business_id || 1];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Product created", id: result.insertId });
  });
});

// GET ALL PRODUCTS
router.get("/", (req, res) => {
  const business_id = req.query.business_id || 1;
  db.query("SELECT * FROM product WHERE isdeleted = 0 AND business_id = ? ORDER BY sortorder ASC", [business_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPDATE PRODUCT
router.put("/update/:id", (req, res) => {
  const { name, shortdescription, longdescription, brandid, saleprice, Isaddon, isinventory, sku, costprice, sortorder } = req.body;
  
  const sql = `UPDATE product SET name=?, shortdescription=?, longdescription=?, brandid=?, saleprice=?, Isaddon=?, isinventory=?, sku=?, costprice=?, sortorder=?, altereddatetime=NOW() WHERE id=? AND isdeleted=0`;
  const values = [name, shortdescription, longdescription, brandid, saleprice, Isaddon, isinventory, sku, costprice, sortorder, req.params.id];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product updated" });
  });
});

// DELETE PRODUCT
router.delete("/delete/:id", (req, res) => {
  db.query("UPDATE product SET isdeleted = 1, altereddatetime = NOW() WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted" });
  });
});

module.exports = router;