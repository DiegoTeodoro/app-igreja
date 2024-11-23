const jwt = require('jsonwebtoken');

// Chave secreta usada para assinar os tokens (mantenha segura em produção)
const SECRET_KEY = 'sua_chave_secreta';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; // O token deve ser enviado no cabeçalho Authorization

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // Remover o prefixo 'Bearer' do token (caso esteja presente)
  const formattedToken = token.startsWith('Bearer ') ? token.slice(7) : token;

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(formattedToken, SECRET_KEY);

    // Anexa as informações do usuário na requisição
    req.userProfile = decoded.perfil; // Supondo que o payload do token contenha o campo "perfil"
    req.userId = decoded.id; // Opcional: id do usuário
    next(); // Permite que a requisição continue
  } catch (err) {
    console.error('Erro ao verificar token:', err.message);
    res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

module.exports = verifyToken;
