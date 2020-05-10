const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const randomstring = require('randomstring');
const config = require('../../config.js');
const dbUser = require('../../db/db-user.js');
const dbProducts = require('../../db/db-products.js');
const dbNegotiation = require('../../db/db-negotiation.js');

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
    res.status(200).json(products);
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
});

api.post('/products', async function(req, res) {
  try {
    const products = await dbProducts.createProduct(req.body.product);
    if (products.status === 'success') {
      return res.status(201).json({ status: 'success' });
    } else {
      return res.status(400).json({ status: 'fail' });
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
});

api.post('/negotiation', async function (req, res) {
  try {
    const userId = req.session.userId;
    const productId = req.body.productId;
    const offer = req.body.offerValue
    console.log("Offer received from")
    console.log(userId)
    console.log(offer)
    const result = await dbNegotiation.check(userId, productId);
    if (result.status === 'exists') {
      // fetch the data
      const negotiationChat = await dbNegotiation.getNegotiation(result.negotiationId)
      const productName = await dbProducts.getProductName(productId);
      return res.status(200).json({ negotiationId: result.negotiationId, product_id: productId, product_name: productName, chat: negotiationChat });
    } else {
      // create a new negotiation
      let negotiationId;
      let check = false;

      while (check === false) {
        negotiationId = randomstring.generate({length: 8,charset: 'alphanumeric'});
        const negotiationIdSearch = await dbNegotiation.checkNegotiationId(negotiationId);
        if (negotiationIdSearch.status === 'empty') {
        check = true;
        }
      }

      await dbNegotiation.createNegotiation(negotiationId, userId, productId);
      const productName = await dbProducts.getProductName(productId);
      res.status(201).json({ negotiationId: negotiationId, product_id: productId, product_name: productName, chat: ['hello, negotiation created'] })
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
})

api.post('/offer/:negotiationId')
