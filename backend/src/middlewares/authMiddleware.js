const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      status: 'erro', 
      mensagem: 'Token de autenticação não fornecido' 
    });
  }

  const partes = authHeader.split(' ');

  if (partes.length !== 2) {
    return res.status(401).json({ 
      status: 'erro', 
      mensagem: 'Erro no formato do token' 
    });
  }

  const [esquema, token] = partes;

  if (!/^Bearer$/i.test(esquema)) {
    return res.status(401).json({ 
      status: 'erro', 
      mensagem: 'Token mal formatado' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        status: 'erro', 
        mensagem: 'Token inválido ou expirado' 
      });
    }

    req.usuarioId = decoded.id;
    req.usuarioLogin = decoded.login;

    return next();
  });
};

module.exports = authMiddleware;