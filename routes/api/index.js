/**
* routes/api/index.js
**/
const APIRouter = require('express').Router();

APIRouter.route('/user/avatar')
  .get(require('./api.js'))

module.exports = APIRouter;