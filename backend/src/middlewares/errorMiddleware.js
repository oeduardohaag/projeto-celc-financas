const { zodError } = require('zod');

function errorMiddleware(err, req, res, next) {
    if (err instanceof zodError) {
        return res.status(400).json({ 
            status: 'erro',
            message: 'Erro ao validar os dados',
            error: err.errors.map(e => ({ campo: e.path.join('.'), mensagem: e.message })) 
        });
    }

    console.error('Erro não tratado:', err);
    return res.status(500).json({ 
        status: 'erro',
        message: 'Erro interno do servidor'
    });
}

module.exports = errorMiddleware; 