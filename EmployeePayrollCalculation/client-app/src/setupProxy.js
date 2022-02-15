const createProxyMiddleware = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/api/**', {
    target: 'https://localhost:7022',
    changeOrigin: true,
    secure: false
  }));
};
