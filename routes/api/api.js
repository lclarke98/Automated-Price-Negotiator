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

api.get('/user/avatar', async function (req, res) {
  try {
    const userId = req.session.userId;
    const userAvatar = await dbUser.getUserAvatar(userId);
    res.send(userAvatar.picture);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});

api.get('/products', async function (req, res) {
  try {
    const products = await dbProducts.getProducts();
    res.status(200).json(products);
  } catch (e) {
    console.log(e)
    res.sendStatus(500);
  }
});

api.post('/products', async function (req, res) {
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
        negotiationId = randomstring.generate({ length: 8, charset: 'alphanumeric' });
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

api.post('/response', async function (req, res) {
  const userId = req.session.userId;
  const negotiationId = req.body.negotiationId;
  const productId = req.body.productId;
  const price = req.body.offerValue;
  const qty = req.body.offerQty;
  let newOffer;
  let finalOffer;
  await dbNegotiation.addUserNegotiationResponse(negotiationId, productId, userId, qty, price)
  newOffer, finalOffer = await negotiationBot(negotiationId, productId, qty, price)
  res.status(201).json({ counterOffer: newOffer, finalOffer: finalOffer })
})

async function negotiationBot(negotiationId, productId, qty, userPriceString) {
  let userPrice = parseFloat(userPriceString)
  percentageDrop = [1, 10, 11, 20] // the percentage difference between offers
  percentageSet = [1, 3, 5] // for calculating new offer
  // get the negotiation using the id provided
  const negotiation = await dbNegotiation.getNegotiation(negotiationId);
  const negotiationLength = negotiation.length;
  // get the proudcts details at the center of the negotiation
  const productDetails = await dbProducts.getProduct(productId);
  // Setup and check finalOffer
  let finalOffer = false;
  if (negotiationLength >= 2) {
    finalOffer = negotiation[negotiationLength-2].finalOffer;
  }
  // Calculations
  const percentageDifference = ((productDetails.product_rrp - userPrice) / ((productDetails.product_rrp + userPrice) / 2)) *100
  console.log("rrp")
  console.log(productDetails.product_rrp)
  console.log("user price")
  console.log(userPrice)
  console.log("percentage diff")
  console.log(percentageDifference)
  let newOffer = negotiation[negotiationLength-1].message;
  if (finalOffer !== true) {
    // If statement for first offer scenario
    if (negotiation.length === 1) { // first response from buying client
      if (userPrice >= productDetails.product_rrp) { // BC offer is higher than start price
        newOffer = productDetails.product_rrp

      } else if (percentageDifference > percentageDrop[1]) { // counter offer exceeds boundaries
        newOffer = productDetails.product_rrp - ((productDetails.product_rrp / 100) * percentageSet[0]) // small percentage drop

      } else if (percentageDifference >= percentageDrop[0] && percentageDifference <= percentageDrop[1]) { // reasonable percentage drop
        newOffer = userPrice + ((productDetails.product_rrp / 100) * (percentageDifference / 2.5)) // take percentage drop / by 2.5

      } else if (percentageDifference >= percentageDrop[2] && percentageDifference <= percentageDrop[3]) { // reasonable percentage drop
        newOffer = userPrice + ((productDetails.product_rrp / 100) * (percentageDifference / 1.25)) // take percentage drop / by 1.25
      }
    } else { // if not first message
      console.log("here")
      const lastOffer = negotiation[negotiationLength-2].message;
      const botPercentageDiff = (lastOffer - userPrice) / ((lastOffer + userPrice) / 2)*100

      if (userPrice >= lastOffer) { // BC offer is higher than rrp price
        newOffer = lastOffer;

      } else if (botPercentageDiff > percentageDrop[3] || userPrice <= productDetails.product_lowestPrice) { // counter offer exceeds upper boundary
        newOffer = lastOffer - ((lastOffer / 100) * percentageSet[0]) // small percentage drop

      } else if (botPercentageDiff >= percentageDrop[2] && botPercentageDiff <= percentageDrop[3]) { // counter offer is in upper boundary
        newOffer = userPrice + ((lastOffer / 100) * (botPercentageDiff / 2.5)) // take percentage drop / by 2.5

      } else if (botPercentageDiff >= percentageDrop[0] && botPercentageDiff <= percentageDrop[1]) { // counter offer is in lower boundary
        newOffer = userPrice + ((lastOffer / 100) * (botPercentageDiff / 1.25)) // take percentage drop / by 1.25

      } else if (botPercentageDiff > percentageDrop[0]) { // counter offer exceeds lower boundary
        newOffer = lastOffer - ((lastOffer/100)*percentageDrop[0]) // send new offer with small drop

      } else if (botPercentageDiff === 0) { // The same offer has been made
        newOffer = negotiation[negotiationLength - 2].message;
      } else {
      }
    }
  }

  const discountPerBuyer = (20 / 5000);
  newOffer = newOffer - (newOffer * (qty * discountPerBuyer));
  
  if (newOffer < userPrice) {
    newOffer = userPrice + ((userPrice / 100) * 1);
  } else if (newOffer < productDetails.product_lowestPrice) {
    finalOffer = true;
    newOffer = userPrice;
  }

  if (negotiationLength / 2 === 3) {
    if (negotiation[negotiationLength - 1].message === negotiation[negotiationLength - 3].message && negotiation[negotiationLength - 1].message === negotiation[negotiationLength - 5].message) {
      finalOffer = true;
    }
  }

  if (newOffer > productDetails.product_rrp){
    newOffer = productDetails.product_rrp
  }

  await dbNegotiation.addBotNegotiationResponse(negotiationId, productId, "BOT", qty, newOffer, finalOffer)
  return newOffer, finalOffer;
}
