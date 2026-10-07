const { z } = require('zod');

const ofertaDizimoSchema = z.object ({
    valor: z.number.positive('O valor deve ser maior que zero.'),
    metodo_pgto: z.enum(['PIX', 'Dinheiro'])
    // continuar aqui
});

const contasSchema = z.object({
    valor: z.number.positive('O valor deve ser maior que zero.')
});

module.exports = { ofertaDizimoSchema, contaSchema };