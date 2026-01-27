const Patient = require('../models/Patient');

// 1. Get All Patients (Ab saare patients milenge, History blank nahi rahegi)
exports.getPatients = async (req, res) => {
  try {
    // adminId filter zaroori hai taaki har doctor ko apna data dikhe
    const patients = await Patient.find({ adminId: req.user.id }).sort({ createdAt: -1 });
    console.log("Total Patients found in DB:", patients.length);
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Add New Patient
exports.addPatient = async (req, res) => {
  try {
    const { name, phone, queueNumber } = req.body;
    const newPatient = new Patient({
      name,
      phone,
      queueNumber,
      adminId: req.user.id,
      status: 'Waiting' // Default status
    });
    const savedPatient = await newPatient.save();
    res.status(201).json(savedPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Update Status (Start / Mark Done logic)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true, runValidators: true }
    );

    console.log("Updated DB Record:", updatedPatient);
    res.status(200).json(updatedPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Update Patient (Edit Profile)
exports.updatePatient = async (req, res) => {
  try {
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
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
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};