const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

// Middleware de protection des routes
exports.protect = async (req, res, next) => {
  let token;
  
  // Vérifier si le token est présent dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Accès non autorisé. Veuillez vous connecter.' 
    });
  }
  
  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier si l'utilisateur existe toujours
    const [user] = await query('SELECT id, role FROM users WHERE id = ?', [decoded.id]);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }
    
    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token invalide ou expiré' 
    });
  }
};

// Middleware d'autorisation par rôle
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette ressource` 
      });
    }
    next();
  };
};
