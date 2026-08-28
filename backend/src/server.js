const app = require('./app');

const port = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
}

module.exports = app;
