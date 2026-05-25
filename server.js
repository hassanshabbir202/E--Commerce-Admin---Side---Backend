// server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", (req, res) => {
  res.send("Server is running Successfully");
});

app.use("/api/categories", categoryRoutes);

app.listen(PORT , () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
