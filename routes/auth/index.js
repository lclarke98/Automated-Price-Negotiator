/**
* routes/auth/index.js
**/
const AuthRouter = require('express').Router();

AuthRouter.route('/login')
  .post(require('./auth.js'))

module.exports = AuthRouter;
