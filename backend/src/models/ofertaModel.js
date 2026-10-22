const pool = require('../config/database');

const ofertaModel = {
    async criar({membroId, valor, data}) {
        const query = `
            INSERT INTO dizimos (membro_id, valor, data) 
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [membroId, valor, data];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async listarOfertas() {
        const query = `SELECT * FROM dizimos;`;
        const result = await pool.query(query);
        return result.rows;
    },

    async editarOferta(id, {membroId, valor, data}) {
        const query = `
            UPDATE dizimos 
            SET membro_id = $1, valor = $2, data = $3 
            WHERE id = $4 
            RETURNING *;
        `;
        const values = [membroId, valor, data, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async excluirOferta(id) {
        const query = `DELETE FROM dizimos WHERE id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
};

module.exports = ofertaModel;