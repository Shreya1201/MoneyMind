const rateLimit = require('express-rate-limit'); 

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    res.status(429).json({
      ResponseType: 'Error',
      ResponseMessage: 'Too many requests, please try again later.',
      Response: null
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      ResponseType: 'Error',
      ResponseMessage: 'Too many login attempts.',
      Response: null
    });
  }
});

module.exports = { apiLimiter, authLimiter };