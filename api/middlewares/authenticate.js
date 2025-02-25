import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        next(); 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
