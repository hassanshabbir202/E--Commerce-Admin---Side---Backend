// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const categoryRoutes = require("./routes/categoryRoutes");
const authRoutes = require("./routes/authRoutes"); 

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Standardizes the URL access route to /assets and ensures files are served correctly
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.get("/", (req, res) => {
  res.send("Server is running Successfully");
});

app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT , () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
