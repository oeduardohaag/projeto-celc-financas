const pool = require("../config/database");

const authModel = {
    async listarDiretoria ({login, senha}) {
        const query = `SELECT * FROM diretoria`;
        const values = [login, senha];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
};

module.exports = authModel;