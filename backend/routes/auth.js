const express = require('express');
const router = express.Router();
const { callStoredProc } = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    try {
        const secretKey = 'Nitish@2001';
        const headerData = req.headers['headerdata'];
        if (!headerData) return res.status(400).json({ error: 'headerData header is required' });

        const parsedHeader = JSON.parse(headerData);
        const tranName = parsedHeader.TranName;
        if (!tranName) return res.status(400).json({ error: 'TranName is required in headerData' });
        if (tranName === 'Login') {
            const params = {
                tranName,
                jsonData: JSON.stringify(req.body)  
            };
            const result = await callStoredProc('sp_ManageUsers', params);
            const dbResponse = result[0];

            if (dbResponse.ResponseType === 'Error') {
                return res.status(200).json(dbResponse);
            }

            let userData = [];
            try {
                userData = JSON.parse(dbResponse.Response);
            } catch (err) {
                return res.status(500).json({ ResponseType: 'Error', ResponseMessage: 'Invalid DB response', Response: [] });
            }

            if (!userData.length) {
                return res.status(200).json({ ResponseType: 'Error', ResponseMessage: 'Invalid credentials', Response: [] });
            }

            const storedHash = userData[0].PasswordHash;
            const isMatch = await bcrypt.compare(req.body.password, storedHash);

            if (!isMatch) {
                return res.status(200).json({ ResponseType: 'Error', ResponseMessage: 'Invalid credentials', Response: [] });
            }

            const token = jwt.sign(
                { email: req.body.email, userId: userData[0].UserId },
                secretKey,
                { expiresIn: '1h' }
            );

            return res.json({
                ResponseType: 'Success',
                ResponseMessage: 'Login successful!',
                Response: { UserId: userData[0].UserId, Theme: userData[0].Theme, Token: token }
            });
        }


        else if (tranName === 'Register') {
            const { email, password, fullName } = req.body;
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const params = {
                tranName,
                jsonData: JSON.stringify({ email, passwordHash, fullName })
            };

            const result = await callStoredProc('sp_ManageUsers', params);
            return res.json(result[0]);
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ ResponseType: 'Error', ResponseMessage: 'Internal server error', Response: [] });
    }
});

module.exports = router;
