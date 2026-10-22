const { z } = require('zod');

const authSchema = z.object({
    login: z.string().min(3, 'O login deve ter no mínimo 3 caracteres')
        .regex(/^[a-zA-Z0-9._-]+$/, 'O login deve conter apenas letras minúsculase números'),
    senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
});

module.exports = authSchema;