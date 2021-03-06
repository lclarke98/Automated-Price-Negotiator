/**
* routes/api/index.js
**/
const APIRouter = require('express').Router();

APIRouter.route('/user/avatar')
  .get(require('./api.js'))

APIRouter.route('/products')
  .get(require('./api.js'))
  .post(require('./api.js'))

APIRouter.route('/negotiation')
  .post(require('./api.js'))

APIRouter.route('/response')
  .post(require('./api.js'))

module.exports = APIRouter;
