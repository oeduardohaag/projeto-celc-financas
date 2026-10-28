const contaModel = require('../models/contaModel');
const dashboardModel = require('../models/dashboardModel');
const { contasSchema } = require('../schemas/contasSchema');

const contaController = {
  async criarConta(req, res, next) {
    try {
      const dadosValidados = contasSchema.parse(req.body);
      const novaConta = await contaModel.criarConta(dadosValidados);
      return res.status(201).json({ status: 'sucesso', dados: novaConta });
    } catch (error) {
      next(error);
    }
  },

  async listarContas(req, res, next) {
    try {
      const filtros = {
        classificacao: req.query.classificacao,
        categoria: req.query.categoria,
        status: req.query.status
      };

      const contas = await contaModel.listarContas(filtros);
      return res.json({ status: 'sucesso', dados: contas });
    } catch (error) {
      next(error);
    }
  },

  async buscarId(req, res, next) {
    try {
      const { id } = req.params;
      const conta = await contaModel.buscarPorId(id);
      
      if (!conta) {
        return res.status(404).json({ status: 'erro', mensagem: 'Conta não encontrada' });
      }
      
      return res.json({ status: 'sucesso', dados: conta });
    } catch (error) {
      next(error);
    }
  },

  async atualizarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, data_pgto } = req.body;

      const contaAtualizada = await contaModel.atualizarStatus(id, status, data_pgto);
      
      if (!contaAtualizada) {
        return res.status(404).json({ status: 'erro', mensagem: 'Conta não encontrada' });
      }
      
      return res.json({ status: 'sucesso', dados: contaAtualizada });
    } catch (error) {
      next(error);
    }
  },

  async deletarConta(req, res, next) {
    try {
      const { id } = req.params;
      const deletado = await contaModel.deletarConta(id);
      
      if (!deletado) {
        return res.status(404).json({ status: 'erro', mensagem: 'Conta não encontrada' });
      }
      
      return res.json({ status: 'sucesso', mensagem: 'Conta removida com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  async resumoDashboard(req, res, next) {
    try {
      const resumo = await dashboardModel.obterResumoGeral();
      return res.json({ status: 'sucesso', dados: resumo });
    } catch (error) {
      next(error);
    }
  },

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

module.exports = contaController;