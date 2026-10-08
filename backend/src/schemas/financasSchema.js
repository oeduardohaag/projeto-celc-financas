const { z } = require('zod');

const ofertaDizimoSchema = z.object ({
    valor: z.number.positive('O valor deve ser maior que zero.'),
    metodo_pgto: z.enum(['PIX', 'Dinheiro']),
    data_pgto: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato deve ser AAAA-MM-DD'),
   membro_id: z.number().int().positive('Membro é obrigatório')
});

const contaSchema = z.object({
  nome_conta: z.string().min(2, 'Nome da conta é obrigatório').max(25),
  valor: z.number().positive('O valor deve ser maior que zero'),
  status: z.enum(['Pendente', 'Pago', 'Vencido']),
  data_vencimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato deve ser AAAA-MM-DD'),
  data_pgto: z.string().nullable().optional()
});

module.exports = { ofertaDizimoSchema, contaSchema };