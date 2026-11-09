
const contasModel = require('../models/contasModel');
const dashboardModel = require('../models/dashboardModel');
const { contasSchema } = require('../schemas/contasSchema');

const contasController = {
  // Função para criar uma nova conta
  async criarConta(req, res, next) {
    try {
      const dadosValidados = contasSchema.parse(req.body);
      const novaConta = await contasModel.criarConta(dadosValidados);
      return res.status(201).json({ status: 'sucesso', dados: novaConta });
    } catch (error) {
      next(error);
    }
  },

  // Função para listar contas com filtros opcionais
  async listarContas(req, res, next) {
    try {
      const filtros = {
        classificacao: req.query.classificacao,
        categoria: req.query.categoria,
        status_conta: req.query.status_conta
      };

      const contas = await contasModel.listarContas(filtros);
      return res.json({ status: 'sucesso', dados: contas });
    } catch (error) {
      next(error);
    }
  },

  // Função para buscar uma conta pelo ID
  async buscarId(req, res, next) {
    try {
      const { id } = req.params;
      const conta = await contasModel.buscarPorId(id);

      if (!conta) {
        return res.status(404).json({ status: 'erro', mensagem: 'Conta não encontrada' });
      }

      return res.json({ status: 'sucesso', dados: conta });
    } catch (error) {
      next(error);
    }
  },

  // Função para atualizar os detalhes de uma conta existente
  async atualizarConta(req, res) {
    const { id } = req.params;

    try {
      const contaAtualizada = await contasModel.atualizarConta(id, req.body);

      if (!contaAtualizada) {
        return res.status(404).json({ erro: 'Conta não encontrada.' });
      }

      return res.status(200).json(contaAtualizada);
    } catch (erro) {
      console.error('Erro ao atualizar conta no controller:', erro);
      return res.status(500).json({ erro: 'Erro interno no servidor ao atualizar conta.' });
    }
  },

  // Função para atualizar o status da conta 
  async atualizarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status_conta, data_pgto } = req.body;

      const contaAtualizada = await contasModel.atualizarStatus(id, status_conta, data_pgto);

      if (!contaAtualizada) {
        return res.status(404).json({ status: 'erro', mensagem: 'Conta não encontrada' });
      }

      return res.json({ status: 'sucesso', dados: contaAtualizada });
    } catch (error) {
      next(error);
    }
  },

  // Função para deletar uma conta pelo ID
    async deletarConta(req, res, next) {
    try {
      const { id } = req.params;
      const deletado = await contasModel.deletarConta(id);

      if (!deletado) {
        return res.status(404).json({ status: 'erro', mensagem: 'Conta não encontrada' });
      }

      return res.json({ status: 'sucesso', mensagem: 'Conta removida com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  // Função para obter o resumo/saldo consolidado (banco e dinheiro)
  async consultarSaldos(req, res, next) {
    try {
      const resumo = await dashboardModel.consultarSaldos();
      return res.json({ status: 'sucesso', resumo });
    } catch (error) {
      next(error);
    }
  },

  // Função para obter o resumo geral das contas
  async obterConfiguracoes(req, res, next) {
    try {
      const config = await dashboardModel.obterConfiguracoes();
      return res.json({ status: 'sucesso', dados: config });
    } catch (error) {
      next(error);
    }
  },

  async salvarConfiguracoes(req, res, next) {
    try {
      const saldo_inicial_banco = Number(req.body.saldo_inicial_banco);
      const saldo_inicial_dinheiro = Number(req.body.saldo_inicial_dinheiro);

      if (Number.isNaN(saldo_inicial_banco) || Number.isNaN(saldo_inicial_dinheiro)) {
        return res.status(400).json({ status: 'erro', mensagem: 'Valores de saldo inválidos' });
      }

      const config = await dashboardModel.salvarConfiguracoes({
        saldo_inicial_banco,
        saldo_inicial_dinheiro,
      });
      return res.json({ status: 'sucesso', dados: config });
    } catch (error) {
      next(error);
    }
  },

  // Função para obter os dados do gráfico de receitas e despesas por mês
  async graficoPorMes(req, res, next) {
    try {
      const { ano } = req.query;
      const dados = await dashboardModel.obterGraficoPorMes(ano);
      return res.json({ status: 'sucesso', dados });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = contasController;