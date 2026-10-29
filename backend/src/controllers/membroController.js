const membroModel = require('../models/membroModel');

const membroController = {
  // Função para criar um novo membro
  async criarMembro(req, res, next) {
    try {
      const novoMembro = await membroModel.criarMembro(req.body);
      return res.status(201).json({ status: 'sucesso', dados: novoMembro });
    } catch (error) {
      next(error);
    }
  },

  // Função para listar todos os membros
  async listarTodos(req, res, next) {
    try {
      const membros = await membroModel.listarTodos();
      return res.json({ status: 'sucesso', dados: membros });
    } catch (error) {
      next(error);
    }
  },

  // Função para buscar um membro pelo ID
  async buscarPorId(req, res, next) {
    try {
      const { id } = req.params;
      const membro = await membroModel.buscarPorId(id);
      
      if (!membro) {
        return res.status(404).json({ status: 'erro', mensagem: 'Membro não encontrado' });
      }
      
      return res.json({ status: 'sucesso', dados: membro });
    } catch (error) {
      next(error);
    }
  },

  // Função para atualizar os detalhes de um membro existente
  async atualizarMembro(req, res, next) {
    try {
      const { id } = req.params;
      const membroAtualizado = await membroModel.atualizarMembro(id, req.body);
      
      if (!membroAtualizado) {
        return res.status(404).json({ status: 'erro', mensagem: 'Membro não encontrado' });
      }
      
      return res.json({ status: 'sucesso', dados: membroAtualizado });
    } catch (error) {
      next(error);
    }
  },

  // Função para deletar um membro pelo ID
  async deletarMembro(req, res, next) {
    try {
      const { id } = req.params;
      const deletado = await membroModel.deletarMembro(id);
      
      if (!deletado) {
        return res.status(404).json({ status: 'erro', mensagem: 'Membro não encontrado' });
      }
      
      return res.json({ status: 'sucesso', mensagem: 'Membro removido com sucesso' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = membroController;