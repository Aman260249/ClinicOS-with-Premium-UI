require("dotenv").config(); // 👈 SIMPLE & CORRECT

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://clinic-os-with-premium-ui.vercel.app"
  ],
  credentials: true
}));

console.log("Checking MONGO_URI:", process.env.MONGO_URI ? "Found ✅" : "Not Found ❌");

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("🚨 MONGO_URI missing");
  process.exit(1);
}

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));

app.get("/", (req, res) => {
  res.send("ClinicOS Backend Live ✅");
});
