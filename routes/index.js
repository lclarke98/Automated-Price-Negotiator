/**
* routes/index.js
**/
module.exports = function(app) {
  app.use('/api', require('./api'));
  app.use('/auth', require('./auth'));
  app.use('/', require('./main'));
};
