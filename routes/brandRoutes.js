// routes/brandRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../db/db");

// 1. IMPORT THE QUERIES DICTIONARY
const { brandQueries } = require("../db/queries");

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

  // 2. USE THE DICTIONARY
  db.query(brandQueries.create, [name, logoUrl], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Brand created", id: result.insertId });
  });
});

// GET ALL BRANDS
router.get("/", (req, res) => {
  // 2. USE THE DICTIONARY
  db.query(brandQueries.getAll, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPDATE BRAND
router.put("/update/:id", upload.single("image"), (req, res) => {
  const { name } = req.body;
  const id = req.params.id;

  let queryToRun;
  let values;

  // Determine if we are updating the image or just the text
  if (req.file) {
    queryToRun = brandQueries.updateWithImage;
    values = [name, req.file.path.replace(/\\/g, "/"), id];
  } else {
    queryToRun = brandQueries.updateWithoutImage;
    values = [name, id];
  }

  // 2. USE THE DICTIONARY
  db.query(queryToRun, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Brand updated" });
  });
});

// DELETE BRAND
router.delete("/delete/:id", (req, res) => {
  // 2. USE THE DICTIONARY
  db.query(brandQueries.softDelete, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Brand deleted" });
  });
});

module.exports = router;