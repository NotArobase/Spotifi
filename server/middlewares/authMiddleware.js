const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user; // Attach user info to request for further use
    next();
  });
}

// function authenticateRole(role) {
//   return (req, res, next) => {
//     if (!req.user || req.user.role !== role) {
//       return res.status(403).json({ error: 'Access forbidden: insufficient permissions.' });
//     }
//     next();
//   };
// }

module.exports = {
  authenticateToken,
//   authenticateRole,
};
