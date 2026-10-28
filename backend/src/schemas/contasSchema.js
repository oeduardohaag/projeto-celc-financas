const { z } = require('zod');

const contasSchema = z.object({
  nome_conta: z.string().max(25, 'O nome deve ter no máximo 25 caracteres').min(1, 'O nome é obrigatório'),
  classificacao: z.enum(['Receita', 'Despesa'], { 
    errorMap: () => ({ message: "A classificação deve ser 'Receita' ou 'Despesa'" }) 
  }),
  categoria: z.enum(['Dízimo', 'Oferta', 'Transferencia', 'Desp. Administrativa', 'Energia', 'Limpeza', 'Água', 'Subsidio Pastoral'], { 
    errorMap: () => ({ message: "Categoria inválida" }) 
  }),
  valor: z.number().positive('O valor deve ser maior que zero'),
  status: z.enum(['Pendente', 'Pago', 'Atrasado'], { 
    errorMap: () => ({ message: "O status deve ser 'Pendente', 'Pago' ou 'Atrasado'" }) 
  }),
  data_vencimento: z.string().min(1, 'A data de vencimento é obrigatória'),
  data_pgto: z.string().nullable().optional(),
  membro_id: z.number().int().nullable().optional()
});

module.exports = { contasSchema };