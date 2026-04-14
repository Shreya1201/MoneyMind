module.exports = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);
  res.status(err.status || 500).json({
    ResponseType: 'Error',
    ResponseMessage: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message,
  });
};