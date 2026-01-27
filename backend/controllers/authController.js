const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register logic (Just for setup)
exports.register = async (req, res) => {
    try {
        const { name, email, password, clinicName } = req.body;
        const newUser = new User({ name, email, password, clinicName });
        await newUser.save();
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login Logic with JWT
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.password === password) { // Simple check for now
        // Token create karna
        const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1d' });
        res.json({ token, user: { name: user.name, clinic: user.clinicName } });
    } else {
        res.status(401).json({ message: "Invalid Credentials" });
    }
};