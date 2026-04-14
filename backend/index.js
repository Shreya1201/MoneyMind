require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // <-- import cors
const authRoutes = require('./routes/auth');
const incomesRoutes = require('./routes/incomes');
const categoriesRoutes = require('./routes/categories');
const expensesRoutes = require('./routes/expenses');
const profileRoute = require('./routes/profile');
const dashboardRoute = require('./routes/dashboard');
const aiRoutes = require('./routes/ai');
const { apiLimiter, authLimiter } = require('./middleware/rateLimiter');
const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;

const app = express();
const PORT = 5000;

// Enable CORS for your frontend
app.use(cors({
    origin: 'http://127.0.0.1:5173',  // frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'headerData', 'Data'], // include custom headers like 'headerData'
    credentials: true // if you send cookies or auth headers
}));

app.use(bodyParser.json());
// app.use('/', apiLimiter);
app.use('/auth', authLimiter, authRoutes);
app.use('/dashboard', apiLimiter, dashboardRoute);
app.use('/incomes', apiLimiter, incomesRoutes);
app.use('/expenses', apiLimiter, expensesRoutes);
app.use('/categories', apiLimiter, categoriesRoutes);
app.use('/profile', apiLimiter, profileRoute);
app.use('/api', apiLimiter, aiRoutes);

app.get('/', (req, res) => res.send('MoneyMind Backend Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
