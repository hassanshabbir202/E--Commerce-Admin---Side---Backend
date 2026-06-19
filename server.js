// F:\E--Commerce-Admin\server.js
require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

// 1. IMPORT THE NEW COLLECTIONS ROUTE
const collectionRoutes = require("./routes/collectionRoutes");

const app = express();
// Keep this at 5000 to avoid conflicts with Next.js on 3000
const PORT = process.env.PORT || 5000; 

const brandRoutes = require("./routes/brandRoutes");
const outletRoutes = require("./routes/outletRoutes");
const productRoutes = require("./routes/productRoutes");
const productMediaRoutes = require("./routes/productMediaRoutes");
const slideshowRoutes = require("./routes/slideshowRoutes");
const paymentSettingsRoutes = require("./routes/paymentSettingsRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images correctly
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running Successfully on port 5000");
});

// 2. MOUNT THE ROUTE TO MATCH YOUR FRONTEND API CLIENT
app.use("/api/collections", collectionRoutes);

// Add these lower down where you mounted /api/collections
app.use("/api/brands", brandRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-media", productMediaRoutes);
app.use("/api/slideshows", slideshowRoutes);
app.use("/api/payment-settings", paymentSettingsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});