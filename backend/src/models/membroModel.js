const pool = require('../config/database');

const MembroModel = {
    async criarMembro(dados) {
        const {
            nome,
            cpf,
            data_nascimento,
            estado_civil,
            sexo,
            telefone,
            filhos } = dados;

        const query = `
            INSERT INTO membros (nome, cpf, data_nascimento, estado_civil, sexo, telefone, filhos)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [nome, cpf, data_nascimento, estado_civil, sexo, telefone, filhos];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async listarTodos() {
        const query = `SELECT * FROM membros;`;
        const result = await pool.query(query);
        return result.rows;
    },

    async buscarPorId(id) {
        const query = `SELECT * FROM membros WHERE id = $1;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    async atualizarMembro(id, { nome, cpf, data_nascimento, estado_civil, sexo, telefone, filhos }) {
        const query = `
            UPDATE membros
            SET nome = $1, cpf = $2, data_nascimento = $3, estado_civil = $4, sexo = $5, telefone = $6, filhos = $7
            WHERE id = $8
            RETURNING *;
        `;
        const values = [nome, cpf, data_nascimento, estado_civil, sexo, telefone, filhos, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async deletarMembro(id) {
        const query = `DELETE FROM membros WHERE id = $1;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = MembroModel;