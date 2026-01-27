const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        try {
            token = token.split(' ')[1]; // "Bearer [Token]" se token nikalna
            const decoded = jwt.verify(token, 'secret_key'); // Token check karna
            req.user = decoded; 
            next(); // Agar sahi hai, toh aage badho (Controller tak jao)
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "No token, no entry!" });
    }
};

module.exports = { protect };