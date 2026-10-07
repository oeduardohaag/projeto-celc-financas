const { z } = require('zod');

const membroSchema = z.object ({
    nome: z.string().min(3, 'O nome deve conter no mínimo 3 letras.'),
    cpf: z.string().length(11, 'O CPF deve ter exatamente 11 dígitos (11122233344).'),
    dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato AAAA/MM/DD.'),
    estadoCivil: z.enum(['Solteiro', 'Casado', 'Separado', 'Divorciado', 'Viúvo']),
    sexo: z.enum(['Masculino', 'Feminino']),
    telefone: z.string(11, 'O telefone deve ter exatamente 11 dígitos (48911112222).'),
    filhos: z.number.int().default(0)
});

module.exports = { membroSchema };