const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    queueNumber: { type: Number },
    status: { type: String, default: 'Waiting' }, // 'Waiting' or 'Checked-in'
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Kis doctor ka patient hai
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);