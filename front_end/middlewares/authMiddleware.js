const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const SECRET_KEY = process.env.SECRET_KEY;

function checkAdminRole(req, res, next) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = decoded.user;
    

    if (user.role === 'admin' || user.role === 'staff') {
      req.user = user.role; // Lưu thông tin user vào req để sử dụng sau
      return next(); // Cho phép truy cập
    } else {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
  } catch (error) {
    return res.status(403).json({ decoded });
  }
}

module.exports = { checkAdminRole };