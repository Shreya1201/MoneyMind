const sql = require("mssql");
const dotenv = require("dotenv");

dotenv.config();
const config = {
  user: process.env.DB_USER,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, 
    trustServerCertificate: true
  }
};

async function getUsers() {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Users');
    return result.recordset;
  } catch (err) {
    console.error(err);
    return [];
  }
}

module.exports = {getUsers};