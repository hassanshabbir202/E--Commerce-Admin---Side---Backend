// routes/collectionRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db/db");

// 1. IMPORT THE QUERIES DICTIONARY
const { collectionQueries } = require("../db/queries");

const collectionUploadPath = "assets/images/collections/";

if (!fs.existsSync(collectionUploadPath)) {
  fs.mkdirSync(collectionUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, collectionUploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);
  if (extValid && mimeValid) cb(null, true);
  else cb(new Error("Only .png, .jpg, .jpeg files are allowed"));
};

const upload = multer({ storage, fileFilter });

// CREATE COLLECTION
router.post("/create", upload.single("image"), (req, res) => {
  try {
    const { name, isactive, business_id, description, sort, parent_id } = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;
    const parsedParentId = parent_id && parent_id !== "null" ? parseInt(parent_id) : null;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const values = [
      name,
      isactive !== undefined ? isactive : 1,
      0,
      business_id || 1, 
      description || "",
      sort || 0,
      imagePath,
      parsedParentId
    ];

    // 2. USE THE QUERY FROM queries.js
    db.query(collectionQueries.create, values, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.status(201).json({ message: "Collection created", collectionId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET ALL COLLECTIONS
router.get("/", (req, res) => {
  const business_id = req.query.business_id || 1; 

  // 2. USE THE QUERY FROM queries.js
  db.query(collectionQueries.getAll, [business_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// GET SINGLE COLLECTION
router.get("/:id", (req, res) => {
  // 2. USE THE QUERY FROM queries.js
  db.query(collectionQueries.getById, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Collection not found" });
    res.json(result[0]);
  });
});

// UPDATE COLLECTION
router.put("/update/:id", upload.single("image"), (req, res) => {
  try {
    const { name, isactive, business_id, description, sort, parent_id } = req.body;
    const id = req.params.id;
    const parsedParentId = parent_id && parent_id !== "null" ? parseInt(parent_id) : null;

    let queryToRun;
    let values;

    // Determine which query to run based on if an image was uploaded
    if (req.file) {
      queryToRun = collectionQueries.updateWithImage;
      values = [name, isactive, business_id || 1, description, sort || 0, parsedParentId, req.file.path.replace(/\\/g, "/"), id];
    } else {
      queryToRun = collectionQueries.updateWithoutImage;
      values = [name, isactive, business_id || 1, description, sort || 0, parsedParentId, id];
    }

    // 2. USE THE QUERY FROM queries.js
    db.query(queryToRun, values, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE COLLECTION
router.delete("/delete/:id", (req, res) => {
  try {
    const id = req.params.id;
    
    // 2. USE THE QUERY FROM queries.js
    db.query(collectionQueries.softDelete, [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "Deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;