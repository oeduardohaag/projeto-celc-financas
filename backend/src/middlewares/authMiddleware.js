const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: 'erro',
      mensagem: 'Acesso negado. O token não foi fornecido.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
    if (err) {
      return res.status(401).json({
        status: 'erro',
        mensagem: 'O Token é inválido ou expirou. Faça o login novamente'
      });
    }

    req.usuarioId = decoded.id;
    req.usuarioLogin = decoded.login;

    return next();
  });
};

module.exports = authMiddleware;