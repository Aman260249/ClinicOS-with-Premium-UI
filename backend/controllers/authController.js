const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password, clinicName } = req.body;
        
        // Pehle check karo user already hai toh nahi
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, clinicName });
        await user.save();
        
        res.status(201).json({ message: "User created successfully! ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        const secret = process.env.JWT_SECRET || 'Codelab_Secret_2026';
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1d' });
        
        res.json({ 
            token, 
            user: { name: user.name, clinic: user.clinicName, role: user.role } 
        });
    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
};