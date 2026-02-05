const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1️⃣ Middleware
app.use(express.json());

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://clinic-os-with-premium-ui.vercel.app"
];

// ✅ CORS CONFIG (FIXED)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ VERY IMPORTANT: Preflight handle
// app.options("*", cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));

// Database
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/clinicos';

mongoose.connect(mongoURI)
  .then(() => console.log("Codelab, MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error:", err));

// Test route
app.get('/', (req, res) => {
  res.send("ClinicOS Backend is Running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🚀`);
});
