const express = require('express');
const router = express.Router();
// Saare functions ko yahan import karna zaroori hai
const { 
    addPatient, 
    getPatients, 
    updateStatus, 
    updatePatient, 
    deletePatient 
} = require('../controllers/patientController');

const { protect } = require('../middleware/authMiddleware');

// Sabhi routes mein 'protect' middleware use hoga
router.post('/add', protect, addPatient); 
router.get('/all', protect, getPatients);

// Status update ke liye (Start/Done buttons)
router.put('/update-status/:id', protect, updateStatus);

// Patient data edit karne ke liye
router.put('/update/:id', protect, updatePatient);

// Delete karne ke liye
router.delete('/delete/:id', protect, deletePatient);

module.exports = router;