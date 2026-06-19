const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../db/db");

const uploadPath = "assets/images/brands/";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  })
});

// CREATE BRAND
router.post("/create", upload.single("image"), (req, res) => {
  const { name } = req.body;
  const logoUrl = req.file ? req.file.path.replace(/\\/g, "/") : null;

  const sql = `INSERT INTO brand_details (name, logo_url, created_datetime, isdeleted) VALUES (?, ?, NOW(), 0)`;
  
  db.query(sql, [name, logoUrl], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Brand created", id: result.insertId });
  });
});

// GET ALL BRANDS
router.get("/", (req, res) => {
  db.query("SELECT * FROM brand_details WHERE isdeleted = 0 ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPDATE BRAND
router.put("/update/:id", upload.single("image"), (req, res) => {
  const { name } = req.body;
  let sql = `UPDATE brand_details SET name=?`;
  let values = [name];

  if (req.file) {
    sql += `, logo_url=?`;
    values.push(req.file.path.replace(/\\/g, "/"));
  }
  sql += ` WHERE id=? AND isdeleted=0`;
  values.push(req.params.id);

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Brand updated" });
  });
});

// DELETE BRAND
router.delete("/delete/:id", (req, res) => {
  db.query("UPDATE brand_details SET isdeleted = 1, deleted_datetime = NOW() WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Brand deleted" });
  });
});

module.exports = router;