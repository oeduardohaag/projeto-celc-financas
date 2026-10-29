const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o cabeçalho de autorização está presente
  if (!authHeader) {
    return res.status(401).json({ 
      status: 'erro', 
      mensagem: 'Token de autenticação não fornecido' 
    });
  }

  const partes = authHeader.split(' ');

  // Verifica se o token está no formato correto (Bearer <token>)
  if (partes.length !== 2) {
    return res.status(401).json({ 
      status: 'erro', 
      mensagem: 'Erro no formato do token' 
    });
  }

  const [esquema, token] = partes;

  // Verifica se o esquema é "Bearer"
  if (!/^Bearer$/i.test(esquema)) {
    return res.status(401).json({ 
      status: 'erro', 
      mensagem: 'Token mal formatado' 
    });
  }

  // Verifica e decodifica o token JWT
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