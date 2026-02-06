const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1]; 
            
            // ✅ Yahan tumhari asli key 'Codelab_Secret_2026' honi chahiye
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Codelab_Secret_2026'); 
            
            req.user = decoded; 
            next(); 
        } catch (error) {
            console.error("JWT Verification Failed:", error.message);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "No token, no entry!" });
    }
};

module.exports = { protect };