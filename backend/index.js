const path = require('path'); // Pehle path ko define karo
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

console.log("Checking MONGO_URI:", process.env.MONGO_URI ? "Found ✅" : "Not Found ❌");

// Database Connection Logic
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("🚨 MONGO_URI missing in Environment Variables!");
} else {
    mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        family: 4 // Force IPv4 for Render-Atlas stability
    })
    .then(() => console.log("Codelab, MongoDB Atlas Connected! 🚀"))
    .catch((err) => console.log("DB Connection Error ❌:", err.message));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));

app.get('/', (req, res) => res.send("ClinicOS Backend is Live! ✨"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));