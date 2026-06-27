const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado',
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'marketplace_secret');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
      data: null,
    });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para esta acción',
      data: null,
    });
  }
  next();
};

module.exports = { authenticate, authorizeRoles };
