const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


// 1. Middleware (Sikhna hai: Ye request ko process karne se pehle check karta hai)
app.use(express.json()); // Body parser: JSON data read karne ke liye

app.use(cors({
  origin: ["https://your-frontend-link.vercel.app", "http://localhost:5173"], // Vercel ka URL yahan dalo
  credentials: true
})); // Cross-Origin: Frontend ko permission dene ke liye

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));

// 2. Database Connection (Using MongoDB Compass)
mongoose.connect('mongodb://localhost:27017/clinicos')
    .then(() => console.log("Codelab, MongoDB Connect  ✅"))
    .catch((err) => console.log("DB Error: ", err));

// 3. Simple Route (Base URL)
app.get('/', (req, res) => {
    res.send("ClinicOS Backend is Running...");
});

// 4. Server Port
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} 🚀`);
});