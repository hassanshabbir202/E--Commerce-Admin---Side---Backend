const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const db = require("../db/db");

const uploadPath = "assets/images/products/gallery/";
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)),
  })
});

// ADD MEDIA TO PRODUCT
router.post("/create", upload.array("images", 5), (req, res) => {
  const { productid, business_id } = req.body;
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: "No images provided" });

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const values = req.files.map((file) => [
    productid, 
    file.filename,
    file.path.replace(/\\/g, "/"), 
    0, // isdeleted
    currentTimestamp, // createddatetime
    business_id || 1
  ]);

  const sql = `INSERT INTO product_media_details (productid, filename, filelocation, isdeleted, createddatetime, business_id) VALUES ?`;
  
  db.query(sql, [values], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Media added successfully", count: result.affectedRows });
  });
});

// GET MEDIA FOR SPECIFIC PRODUCT
router.get("/:productid", (req, res) => {
  db.query("SELECT * FROM product_media_details WHERE productid = ? AND isdeleted = 0", [req.params.productid], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// DELETE MEDIA
router.delete("/delete/:id", (req, res) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  db.query("UPDATE product_media_details SET isdeleted = 1, deleted_datetime = ? WHERE id = ?", [currentTimestamp, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Media deleted" });
  });
});

module.exports = router;