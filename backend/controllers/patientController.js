const Patient = require('../models/Patient');

// 1. Get All Patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ adminId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Add New Patient (With Auto-Queue Logic)
exports.addPatient = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    // Auto-calculate Queue Number: Aaj kitne patients aaye hain?
    const count = await Patient.countDocuments({ adminId: req.user.id });
    const nextQueueNumber = count + 1;

    const newPatient = new Patient({
      name,
      phone,
      queueNumber: nextQueueNumber, // Auto assigned
      adminId: req.user.id,
      status: 'Waiting'
    });

    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Update Status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Security check: Find by ID AND AdminId
    const updatedPatient = await Patient.findOneAndUpdate(
      { _id: id, adminId: req.user.id }, 
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedPatient) return res.status(404).json({ message: "Patient not found or unauthorized" });
    res.status(200).json(updatedPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Update Patient (Edit Profile)
exports.updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user.id },
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Delete Patient
exports.deletePatient = async (req, res) => {
  try {
    const deleted = await Patient.findOneAndDelete({ _id: req.params.id, adminId: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Not authorized" });
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};