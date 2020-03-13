const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../../config.js');
const dbUser = require('../../db/db-user.js');
const dbProducts = require('../../db/db-products.js');

const api = express.Router();

module.exports = api;

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(session(config.cookie));

api.get('/user/avatar', async function(req, res) {
  try {
    const userId = req.session.userId;
    const userAvatar = await dbUser.getUserAvatar(userId);
    res.send(userAvatar.picture);
  } catch(e) {
    console.log(e);
    res.sendStatus(404);
  }
});

api.get('/products', async function(req, res) {
  try {
    const products = await dbProducts.getProducts();
    console.log(products)
    res.status(200).json(products);
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
});
