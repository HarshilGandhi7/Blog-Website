import jwt from 'jsonwebtoken';

export const onlyadmin = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded;
        next(); 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
