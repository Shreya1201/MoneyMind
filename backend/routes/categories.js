// routes/categories.js
const express = require('express');
const router = express.Router();
const { callStoredProc } = require('../db');
const {authenticate} = require('../middleware/authMiddleware.js')
router.get('/', authenticate, async (req, res) => {
    try {
        const headerData = req.headers['headerdata']; 
        const data = req.headers['data'];
        if (!headerData) return res.status(400).json({ error: 'headerData header is required' });
        const parsedData = JSON.parse(data);
        const parsedHeader = JSON.parse(headerData);
        const params = {
            tranName: parsedHeader.TranName,
            jsonData: parsedHeader.JsonData,
            userId: parsedData.UserId
        };
        const result = await callStoredProc('sp_ManageCategory', params);
        result[0].Response = JSON.parse(result[0].Response);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            ResponseType: 'Error',
            ResponseMessage: 'InternalServerError',
            Response: null
        });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const headerData = req.headers['headerdata']; 
        const data = req.headers['data'];
        if (!headerData) return res.status(400).json({ error: 'headerData header is required' });
        const parsedData = JSON.parse(data);
        const parsedHeader = JSON.parse(headerData);
        const params = {
            tranName: parsedHeader.TranName,
            jsonData: JSON.stringify(req.body),
            userId: parsedData.UserId,
        };
        const result = await callStoredProc('sp_ManageCategory', params);
        res.json(result[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            ResponseType: 'Error',
            ResponseMessage: 'InternalServerError',
            Response: null
        });
    }
});


module.exports = router;
