const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    clinicName: { type: String, required: true },
    role: { type: String, default: 'admin' } // 'admin' for doctor/receptionist [cite: 11]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);