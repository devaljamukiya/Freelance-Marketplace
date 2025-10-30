const jwt = require('jsonwebtoken')
require('dotenv').config()

const authMiddleware = (req, res, next) => {
    // const token = req.headers("token")
    const token = req.headers['authorization'].split(" ")[1]
    console.log(token)

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        // console.log(decoded);
        
        // req.user = { id: decoded.id,companyName:decoded.companyName,role:decoded.role };
        req.user = decoded;
        console.log(req.user)
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};



module.exports = authMiddleware