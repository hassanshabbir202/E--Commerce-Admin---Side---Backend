const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db/db');

// MULTER CONFIG (IMAGE UPLOAD)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;

  const extValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('Only .png, .jpg, .jpeg files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
});


// CREATE CATEGORY

router.post('/create', upload.single('thumbnail'), (req, res) => {
  try {
    const { name, status, type, googleCategory } = req.body;
    const thumbnail = req.file ? req.file.path : null;

    if (!name || !type || !googleCategory) {
      return res.status(400).json({
        message: 'Name, Type and Google Category are required',
      });
    }

    const sql = `
      INSERT INTO categories 
      (name, status, type, googleCategory, thumbnail)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, status || 'active', type, googleCategory, thumbnail],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Database error',
            error: err,
          });
        }

        res.status(201).json({
          message: 'Category created successfully',
          categoryId: result.insertId,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error,
    });
  }
});


// GET ALL CATEGORIES

router.get('/', (req, res) => {
  const sql = 'SELECT * FROM categories ORDER BY id DESC';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Database error',
        error: err,
      });
    }

    res.json(results);
  });
});

// GET SINGLE CATEGORY

router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM categories WHERE id = ?';

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Database error',
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: 'Category not found',
      });
    }

    res.json(result[0]);
  });
});


// UPDATE CATEGORY

router.put('/update/:id', upload.single('thumbnail'), (req, res) => {
  try {
    const { name, status, type, googleCategory } = req.body;
    const id = req.params.id;

    let sql = `
      UPDATE categories 
      SET name=?, status=?, type=?, googleCategory=?
    `;

    let values = [name, status, type, googleCategory];

    if (req.file) {
      sql += `, thumbnail=?`;
      values.push(req.file.path);
    }

    sql += ` WHERE id=?`;
    values.push(id);

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Database error',
          error: err,
        });
      }
      res.json({
        message: 'Category updated successfully',
      });
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error,
    });
  }
});