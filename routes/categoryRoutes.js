// routes\categoryRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db/db");

const categoryUploadPath = "assests/images/categories/";

if (!fs.existsSync(categoryUploadPath)) {
  fs.mkdirSync(categoryUploadPath, { recursive: true });
}

// MULTER CONFIG (IMAGE UPLOAD)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "categoryUploadPath");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;

  const extValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// CREATE CATEGORY to products_collection

router.post("/create", upload.single("image"), (req, res) => {
  try {
    const { name, isactive, busniness_id, description, sort } = req.body;
    const thumbnail = req.file ? req.file.path.replace(/\\/g, "/") : null;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const sql = `
      INSERT INTO categories 
      (name, isactive, isdeleted, business_id, description, sort, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      isactive !== undefined ? isactive : 1,
      0,
      busniness_id || 1,
      description || "",
      sort || 0,
      imagePath,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err,
        });
      }

      res.status(201).json({
        message: "Collection created in live DB",
        collectionId: result.insertId,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// GET ALL CATEGORIES

router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err,
      });
    }

    res.json(results);
  });
});

// GET SINGLE CATEGORY

router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM product_collection WHERE id = ? AND isdeleted = 0";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(result[0]);
  });
});

// UPDATE CATEGORY

router.put("/update/:id", upload.single("image"), (req, res) => {
  try {
    const { name, isactive, busniness_id, description, sort } = req.body;
    const id = req.params.id;

    let sql = `
      UPDATE product_collection SET name=?, isactive=?, business_id=?, description=?, sort=?
    `;

    let values = [name, isactive, busniness_id, description, sort];

    if (req.file) {
      sql += `, image=?`;
      values.push(req.file.path.replace(/\\/g, "/"));
    }

    sql += ` WHERE id=?`;
    values.push(id);

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Database error",
          error: err,
        });
      }
      res.json({
        message: "Category updated successfully in live DB",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
