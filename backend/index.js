require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// 1. Middlewares
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://clinic-os-with-premium-ui.vercel.app"
  ],
  credentials: true
}));

// 2. Health Check Route (Sabse upar rakho)
app.get("/", (req, res) => {
  res.send("ClinicOS Backend Live ✅");
});

// 3. Database Connection & Server Start
const mongoURI = process.env.MONGO_URI;

console.log("Checking MONGO_URI:", mongoURI ? "Found ✅" : "Not Found ❌");

if (!mongoURI) {
  console.error("🚨 MONGO_URI missing in Environment Variables!");
  process.exit(1);
}

mongoose.connect(mongoURI) // Simple and clean for Atlas
  .then(() => {
    console.log("✅ MongoDB Connected to Atlas");

    // Routes ko connection ke baad load karna zyada safe hai
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/patients", require("./routes/patientRoutes"));

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, "0.0.0.0", () => { // 0.0.0.0 Render ke liye helpful hota hai
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });