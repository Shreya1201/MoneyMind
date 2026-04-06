// const { sql, poolPromise } = require("../db.js");

// async function manageIncome(tranName, userId, incomeData = {}) {
//     try {
//         const pool = await poolPromise;

//         const result = await pool.request()
//             .input("tranName", sql.NVarChar(20), tranName)
//             .input("userId", sql.Int, userId)
//             .input("incomeId", sql.Int, incomeData.IncomeId || null)
//             .input("categoryId", sql.Int, incomeData.CategoryId || null)
//             .input("amount", sql.Decimal(18,2), incomeData.Amount || null)
//             .input("date", sql.Date, incomeData.Date || null)
//             .input("notes", sql.NVarChar(500), incomeData.Notes || null)
//             .input("recurrenceType", sql.NVarChar(20), incomeData.RecurrenceType || null)
//             .input("recurrenceEndDate", sql.Date, incomeData.RecurrenceEndDate || null)
//             .execute("sp_ManageIncome");

//         return {
//             responseType: "success",
//             response: result.recordset || {},
//             responseMessage: `${tranName} transaction successful`
//         };

//     } catch (err) {
//         console.error(err);
//         return {
//             responseType: "error",
//             response: {},
//             responseMessage: `Failed to ${tranName} income`
//         };
//     }
// }

// module.exports = { manageIncome };
