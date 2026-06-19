const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../db/db");

const uploadPath = "assets/images/slideshows/";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  })
});

// CREATE SLIDE
router.post("/create", upload.single("image"), (req, res) => {
  const { business_id, heading, subheading, button_text, button_link, issamewin, isactive, sorting } = req.body;
  const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

  const sql = `INSERT INTO theme_slide_show (business_id, heading, subheading, button_text, button_link, issamewin, isactive, sorting, created_datetime, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;
  const values = [business_id || 1, heading, subheading, button_text, button_link, issamewin || 0, isactive || 1, sorting || 0, imagePath];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Slide created", id: result.insertId });
  });
});

// GET ALL SLIDES
router.get("/", (req, res) => {
  const business_id = req.query.business_id || 1;
  db.query("SELECT * FROM theme_slide_show WHERE business_id = ? ORDER BY sorting ASC", [business_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// DELETE SLIDE (Hard Delete - no isdeleted column)
router.delete("/delete/:id", (req, res) => {
  db.query("DELETE FROM theme_slide_show WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Slide permanently deleted" });
  });
});

module.exports = router;