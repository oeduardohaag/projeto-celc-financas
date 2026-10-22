const pool = require('../config/database');

const MembroModel = {
    async criar({nome, cpf, dataNascimento, estadoCivil, telefone}) {
        const query = `
            INSERT INTO membros (nome, cpf, data_nascimento, estado_civil, telefone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [nome, cpf, dataNascimento, estadoCivil, telefone];
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

    async atualizar(id, {nome, cpf, dataNascimento, estadoCivil, telefone}) {
        const query = `
            UPDATE membros
            SET nome = $1, cpf = $2, data_nascimento = $3, estado_civil = $4, telefone = $5
            WHERE id = $6
            RETURNING *;
        `;
        const values = [nome, cpf, dataNascimento, estadoCivil, telefone, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async excluir(id) {
        const query = `DELETE FROM membros WHERE id = $1;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = MembroModel;