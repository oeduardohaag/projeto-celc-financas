const { z } = require('zod');

const lancamentoSchema = z.object({
  tipo: z.enum(['receita', 'despesa'], {
    errorMap: () => ({ message: "O tipo deve ser obrigatoriamente 'receita' ou 'despesa'" })}),
  categoria: z.string().min(2, 'A categoria deve ter no mínimo 2 caracteres'),
  descricao: z.string().min(2, 'A descrição deve ter no mínimo 2 caracteres').optional().nullable(),
  valor: z.coerce.number().positive('O valor deve ser um número maior que zero'),
  data_vencimento: z.string().min(1, 'A data de vencimento é obrigatória'),
  data_pagamento: z.string().optional().nullable(),
  status: z.enum(['pendente', 'pago', 'recebido'], {
    errorMap: () => ({ message: "O status deve ser 'pendente', 'pago' ou 'recebido'" })}).default('pendente'),
  membro_id: z.coerce.number().int().optional().nullable()
});

module.exports = { lancamentoSchema };