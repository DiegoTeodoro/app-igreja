const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config'); // Ajuste o caminho para o local correto do arquivo

// Função de verificação de token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; 

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const formattedToken = token.startsWith('Bearer ') ? token.slice(7) : token;

  try {
    const decoded = jwt.verify(formattedToken, SECRET_KEY);
    req.userProfile = decoded.perfil;
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = verifyToken;
