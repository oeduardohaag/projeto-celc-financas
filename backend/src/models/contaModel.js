const pool = require('../config/database');

const contaModel = {
    async criar({descricao, tipo, valor, data}) {
        const query = `
            INSERT INTO contas (descricao, tipo, valor, data) 
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [descricao, tipo, valor, data];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async listarContas() {
        const query = `SELECT * FROM contas;`;
        const result = await pool.query(query);
        return result.rows;
    },

    async editarConta(id, {descricao, tipo, valor, data}) {
        const query = `
            UPDATE contas 
            SET descricao = $1, tipo = $2, valor = $3, data = $4 
            WHERE id = $5 
            RETURNING *;
        `;
        const values = [descricao, tipo, valor, data, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async excluirConta(id) {
        const query = `DELETE FROM contas WHERE id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = contaModel;