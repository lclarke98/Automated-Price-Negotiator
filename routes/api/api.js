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
    console.log("Offer received from")
    console.log(userId)
    const result = await dbNegotiation.check(userId, productId);
    if (result.status === 'exists') {
      // fetch the data
      const negotiationMessages = await dbNegotiation.getNegotiationMessages(result.negotiationId)
      const productName = await dbProducts.getProductName(productId);
      return res.status(200).json({ negotiationId: result.negotiationId, product_id: productId, product_name: productName, messages: negotiationMessages });
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
      res.status(201).json({ negotiationId: negotiationId, product_id: productId, product_name: productName, messages: [] })
    }
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
})

api.post('/response', async function(req, res) {
  const userId = req.session.userId;
  const negotiationId = req.body.negotiationId;
  const productId = req.body.productId;
  const price = req.body.offerValue;
  const qty = req.body.offerQty;
  console.log(price)
  console.log(qty)
  await dbNegotiation.addNegotiationResponse(negotiationId, productId, userId, qty, price)
  // NEGOTIATION ALGORITHM
})

// async function negotiationBot(negotiationId, productId, qty, userPrice) {
//   percentageDrop = [] // the percentage difference between offers
//   percentageOffer = [] // for calculating new offer
//   // get the negotiation using the id provided
//   const negotiation = await dbNegotiation.getNegotiation(negotiationId);
//   // get the proudcts details at the center of the negotiation
//   const productDetails = await dbProducts.getProduct(productId);
//   // If statement for first offer scenario
//   if (negotiation.length === 2) {// first msg
//     if(negotiation[2].message > productDetails.product_rrp){// offer higher than start price
//       newOffer = productDetails.product_rrp

//     } else if (productDetails.product_rrp - negotiation[2].message == percentageDrop[0]) { // too small a drop
//       newOffer = productDetails.product_rrp - percentageSet[0] // small percentage drop

//     } else if(negotiation[i].message - userPrice == percentageDrop[2]){ // ideal percentage drop
//       newOffer = userPrice - percentageDrop / 2 // take percentage drop / by 2

//     }else {// if not first message

//       if(negotiation[i].message - userPrice == percentageDrop[0]) {//for small drop in last offer
//         newOffer = productDetails.product_rrp - percentageSet[0] // send new offerwith small drop

//       }else if(negotiation[i].message - userPrice == percentageDrop[2]){ // ideal percentage drop
//         newOffer = userPrice - percentageDrop / 2 // take percentage drop / by 2
        
//       }else if (negotiation[i].message - userPrice  > percentageDrop[1]){// too big a drop in price
//         newoffer = negotiation[i].message - percentageDrop[2]
//       } 
//     }
//   } else {
//     const discountPerBuyer = (20 / 5000);
//     let newOfferPrice = newOffer - (newOffer * (qty * discountPerBuyer));
//   }
//   if (newOfferPrice < userPrice) {
//     do something
//     exeception that you do not go over rrp set for product.
//   }
//   await dbNegotiation.addNegotiationResponse(negotiationId, productId, "BOT", qty, WHATE HE DEDUCES)
//   res.send
// }