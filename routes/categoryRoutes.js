// // routes\categoryRoutes.js
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

// // MULTER CONFIG (IMAGE UPLOAD)

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, categoryUploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;

//   const extValid = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase(),
//   );

//   const mimeValid = allowedTypes.test(file.mimetype);

//   if (extValid && mimeValid) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .png, .jpg, .jpeg files are allowed"));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
// });

// // CREATE CATEGORY to products_collection

// router.post("/create", upload.single("image"), (req, res) => {
//   try {
//     const { name, isactive, busniness_id, description, sort } = req.body;
//     const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

//     if (!name) {
//       return res.status(400).json({
//         message: "Name is required",
//       });
//     }

//     const sql = `
//       INSERT INTO product_collection 
//       (name, isactive, isdeleted, business_id, description, sort, image)
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       name,
//       isactive !== undefined ? isactive : 1,
//       0,
//       busniness_id || 1,
//       description || "",
//       sort || 0,
//       imagePath,
//     ];

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         return res.status(500).json({
//           message: "Database error",
//           error: err,
//         });
//       }

//       res.status(201).json({
//         message: "Collection created in live DB",
//         collectionId: result.insertId,
//       });
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// });

// // GET ALL CATEGORIES

// router.get("/", (req, res) => {
//   const { business_id } = req.query;

//   if (!business_id) {
//     return res.status(400).json({ message: "business_id query parameter is required" });
//   }

//   // Ensures a user only sees categories belonging to their own business identity
//   const sql = "SELECT * FROM product_collection WHERE isdeleted = 0 AND business_id = ? ORDER BY id DESC";

//   db.query(sql, [business_id], (err, results) => {
//     if (err) {
//       return res.status(500).json({
//         message: "Database error",
//         error: err,
//       });
//     }

//     res.json(results);
//   });
// });

// // GET SINGLE CATEGORY

// router.get("/:id", (req, res) => {
//   const sql = "SELECT * FROM product_collection WHERE id = ? AND isdeleted = 0";

//   db.query(sql, [req.params.id], (err, result) => {
//     if (err) {
//       return res.status(500).json({
//         message: "Database error",
//         error: err,
//       });
//     }

//     if (result.length === 0) {
//       return res.status(404).json({
//         message: "Category not found",
//       });
//     }

//     res.json(result[0]);
//   });
// });

// // UPDATE CATEGORY

// router.put("/update/:id", upload.single("image"), (req, res) => {
//   try {
//     const { name, isactive, busniness_id, description, sort } = req.body;
//     const id = req.params.id;

//     let sql = `
//       UPDATE product_collection SET name=?, isactive=?, business_id=?, description=?, sort=?
//     `;

//     let values = [name, isactive, busniness_id, description, sort];

//     if (req.file) {
//       sql += `, image=?`;
//       values.push(req.file.path.replace(/\\/g, "/"));
//     }

//     // Prevents editing items that have been soft-deleted
//     sql += ` WHERE id=? AND isdeleted=0`;
//     values.push(id);

//     db.query(sql, values, (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: "Database error", error: err });
//       }
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "Category not found or unavailable" });
//       }
//       res.json({ message: "Category updated successfully in live DB" });
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Server error",
//       error: error.message,
//     });
//   }
// });

// // DELETE CATEGORY (Soft Delete)
// router.delete("/delete/:id", (req, res) => {
//   try {
//     const id = req.params.id;
    
//     // Updates isdeleted to 1 instead of permanently wiping the row
//     const sql = "UPDATE product_collection SET isdeleted = 1 WHERE id = ?";

//     db.query(sql, [id], (err, result) => {
//       if (err) {
//         return res.status(500).json({ message: "Database error", error: err });
//       }
      
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "Category not found" });
//       }
      
//       res.json({ message: "Category deleted successfully" });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;


// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db/db");

const categoryUploadPath = "assets/images/categories/";

if (!fs.existsSync(categoryUploadPath)) {
  fs.mkdirSync(categoryUploadPath, { recursive: true });
}

// MULTER CONFIG (IMAGE UPLOAD)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, categoryUploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
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

// CREATE CATEGORY
router.post("/create", upload.single("image"), (req, res) => {
  try {
    // Fixed typo: busniness_id -> business_id
    const { name, isactive, business_id, description, sort } = req.body;
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const sql = `
      INSERT INTO product_collection 
      (name, isactive, isdeleted, business_id, description, sort, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      isactive !== undefined ? isactive : 1,
      0,
      business_id || 1, // TODO: Auth Bypass - defaults to 1 if no user is logged in
      description || "",
      sort || 0,
      imagePath,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(201).json({
        message: "Collection created in live DB",
        collectionId: result.insertId,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET ALL CATEGORIES
router.get("/", (req, res) => {
  // TODO: Auth Bypass - Hardcoded to business_id 1 for testing.
  // Later this will be: const business_id = req.user.business_id;
  const business_id = req.query.business_id || 1; 

  const sql = "SELECT * FROM product_collection WHERE isdeleted = 0 AND business_id = ? ORDER BY id DESC";

  db.query(sql, [business_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});

// GET SINGLE CATEGORY
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM product_collection WHERE id = ? AND isdeleted = 0";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Category not found" });
    
    res.json(result[0]);
  });
});

// UPDATE CATEGORY
router.put("/update/:id", upload.single("image"), (req, res) => {
  try {
    const { name, isactive, business_id, description, sort } = req.body;
    const id = req.params.id;

    let sql = `UPDATE product_collection SET name=?, isactive=?, business_id=?, description=?, sort=?`;
    let values = [
      name, 
      isactive, 
      business_id || 1, // TODO: Auth bypass fallback
      description, 
      sort || 0
    ];

    if (req.file) {
      sql += `, image=?`;
      values.push(req.file.path.replace(/\\/g, "/"));
    }

    sql += ` WHERE id=? AND isdeleted=0`;
    values.push(id);

    db.query(sql, values, (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found or unavailable" });
      
      res.json({ message: "Category updated successfully in live DB" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE CATEGORY (Soft Delete)
router.delete("/delete/:id", (req, res) => {
  try {
    const id = req.params.id;
    const sql = "UPDATE product_collection SET isdeleted = 1 WHERE id = ?";

    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found" });
      
      res.json({ message: "Category deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;