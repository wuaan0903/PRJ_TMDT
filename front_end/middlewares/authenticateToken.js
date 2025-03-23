import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header Authorization

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Giải mã token
        req.user = decoded; // Lưu thông tin user vào req
        next(); // Tiếp tục xử lý request
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};