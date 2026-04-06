// db.js
const odbc = require('odbc');

const connectionString = 'Driver={SQL Server};Server=7230SHREYA4814\\SQLEXPRESS;Database=MoneyMindDB;Trusted_Connection=Yes;MultipleActiveResultSets=True;';

let connection;

async function getConnection() {
    if (!connection) {
        connection = await odbc.connect(connectionString);
        console.log("Connected to SQL Server successfully");
    }
    return connection;
}

/**
 * Call a stored procedure with dynamic parameters
 * @param {string} procName - Stored procedure name
 * @param {object} params - Key-value object of parameters
 */
async function callStoredProc(procName, params = {}) {
    try {
        const conn = await getConnection();

        const paramKeys = Object.keys(params);
        const paramPlaceholders = paramKeys.map(k => `@${k}=?`).join(', ');

        const sqlQuery = paramKeys.length > 0 ? `EXEC ${procName} ${paramPlaceholders}` : `EXEC ${procName}`;

        const paramValues = paramKeys.map(k => params[k]);
        const result = await conn.query(sqlQuery, paramValues);
        return result;
    } catch (err) {
        console.error('DB Error:', err);
        throw err;
    }
}

module.exports = { callStoredProc };
