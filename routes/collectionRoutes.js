
// // routes/categoryRoutes.js
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const db = require("../db/db");

// const categoryUploadPath = "assets/images/categories/";

// if (!fs.existsSync(categoryUploadPath)) {
//   fs.mkdirSync(categoryUploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, categoryUploadPath),
//   filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimeValid = allowedTypes.test(file.mimetype);
//   if (extValid && mimeValid) cb(null, true);
//   else cb(new Error("Only .png, .jpg, .jpeg files are allowed"));
// };

// const upload = multer({ storage, fileFilter });

// // CREATE CATEGORY
// router.post("/create", upload.single("image"), (req, res) => {
//   try {
//     // ADDED: parent_id extracted correctly
//     const { name, isactive, business_id, description, sort, parent_id } = req.body;
//     const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;
//     const parsedParentId = parent_id && parent_id !== "null" ? parseInt(parent_id) : null;

//     if (!name) return res.status(400).json({ message: "Name is required" });

//     const sql = `
//       INSERT INTO product_collection 
//       (name, isactive, isdeleted, business_id, description, sort, image, parent_id)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       name,
//       isactive !== undefined ? isactive : 1,
//       0,
//       business_id || 1, 
//       description || "",
//       sort || 0,
//       imagePath,
//       parsedParentId // Added to insertion
//     ];

//     db.query(sql, values, (err, result) => {
//       if (err) return res.status(500).json({ message: "Database error", error: err });
//       res.status(201).json({ message: "Collection created", collectionId: result.insertId });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // GET ALL CATEGORIES
// router.get("/", (req, res) => {
//   const business_id = req.query.business_id || 1; 
//   const sql = "SELECT * FROM product_collection WHERE isdeleted = 0 AND business_id = ? ORDER BY id DESC";

//   db.query(sql, [business_id], (err, results) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err });
//     res.json(results);
//   });
// });

// // GET SINGLE CATEGORY
// router.get("/:id", (req, res) => {
//   const sql = "SELECT * FROM product_collection WHERE id = ? AND isdeleted = 0";
//   db.query(sql, [req.params.id], (err, result) => {
//     if (err) return res.status(500).json({ message: "Database error", error: err });
//     if (result.length === 0) return res.status(404).json({ message: "Category not found" });
//     res.json(result[0]);
//   });
// });

// // UPDATE CATEGORY
// router.put("/update/:id", upload.single("image"), (req, res) => {
//   try {
//     const { name, isactive, business_id, description, sort, parent_id } = req.body;
//     const id = req.params.id;
//     const parsedParentId = parent_id && parent_id !== "null" ? parseInt(parent_id) : null;

//     let sql = `UPDATE product_collection SET name=?, isactive=?, business_id=?, description=?, sort=?, parent_id=?`;
//     let values = [name, isactive, business_id || 1, description, sort || 0, parsedParentId];

//     if (req.file) {
//       sql += `, image=?`;
//       values.push(req.file.path.replace(/\\/g, "/"));
//     }

//     sql += ` WHERE id=? AND isdeleted=0`;
//     values.push(id);

//     db.query(sql, values, (err, result) => {
//       if (err) return res.status(500).json({ message: "Database error", error: err });
//       if (result.affectedRows === 0) return res.status(404).json({ message: "Not found" });
//       res.json({ message: "Updated successfully" });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// // DELETE CATEGORY
// router.delete("/delete/:id", (req, res) => {
//   try {
//     const id = req.params.id;
//     // Optional: You could also delete child categories here, but soft deleting the parent is safer.
//     const sql = "UPDATE product_collection SET isdeleted = 1 WHERE id = ?";
//     db.query(sql, [id], (err, result) => {
//       if (err) return res.status(500).json({ message: "Database error", error: err });
//       res.json({ message: "Deleted successfully" });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;

// routes/collectionRoutes.js (formerly categoryRoutes.js)
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db/db");

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

    const sql = `
      INSERT INTO product_collection 
      (name, isactive, isdeleted, business_id, description, sort, image, parent_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

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

    db.query(sql, values, (err, result) => {
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
  const sql = "SELECT * FROM product_collection WHERE isdeleted = 0 AND business_id = ? ORDER BY id DESC";

  db.query(sql, [business_id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// GET SINGLE COLLECTION
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM product_collection WHERE id = ? AND isdeleted = 0";
  db.query(sql, [req.params.id], (err, result) => {
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

    let sql = `UPDATE product_collection SET name=?, isactive=?, business_id=?, description=?, sort=?, parent_id=?`;
    let values = [name, isactive, business_id || 1, description, sort || 0, parsedParentId];

    if (req.file) {
      sql += `, image=?`;
      values.push(req.file.path.replace(/\\/g, "/"));
    }

    sql += ` WHERE id=? AND isdeleted=0`;
    values.push(id);

    db.query(sql, values, (err, result) => {
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
    const sql = "UPDATE product_collection SET isdeleted = 1 WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      res.json({ message: "Deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;