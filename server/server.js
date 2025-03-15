require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const auth = require("./routes/auth");
const parking = require("./routes/parkingRoutes");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/userRoutes");
const adminHistoryRoutes = require("./routes/adminHistory");
const accessRoutes = require("./routes/accessRoutes");


const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MongoDB connection string is missing.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", auth);
app.use("/api/parking", parking);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin-history", adminHistoryRoutes);
app.use("/api/access", accessRoutes);

// MongoDB Connection
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));