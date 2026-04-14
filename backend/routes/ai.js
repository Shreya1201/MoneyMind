// routes/ai.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { authenticate } = require('../middleware/authMiddleware.js');
const { callStoredProc } = require('../db');
const express = require('express');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/ai/insights', authenticate, async (req, res) => {
  try {
    const { question } = req.body;

    const userId = Number(req.user.userId);

    // ✅ Fetch user financial data
    const result = await callStoredProc('sp_DashboardData', { 
      tranName: 'GetData',
      jsonData: '',
      userId 
    });

    let summary = {};

    if (result && result[0] && result[0].Response) {
      summary = typeof result[0].Response === 'string'
        ? JSON.parse(result[0].Response)
        : result[0].Response;
    }

    // ✅ Build strong context (THIS is your power now)
    const context = `
You are a smart personal finance advisor.

User Financial Data:
- Total Income: ₹${summary.TotalIncome || 0}
- Current Balance: ₹${summary.Balance || 0}
- Total Expense: ₹${summary.TotalExpense || 0}

Instructions:
- Give practical, actionable advice
- Be concise
- Use numbers when possible
- Answer based on user's financial data

User Question: ${question}
`;

    // ✅ Gemini model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });

    const result2 = await model.generateContent(context);

    res.json({
      answer: result2.response.text()
    });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: 'AI failed' });
  }
});

module.exports = router;