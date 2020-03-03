const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');
const dbUser = require('../../db/db-user.js');

const login = express.Router();

module.exports = login;

login.use(bodyParser.json());
login.use(bodyParser.urlencoded({ extended: true }));
login.use(session(config.cookie));

login.post('/login', async function(req, res) {
  try {
    const token = req.body.idtoken; // Verify the token recieved
    const ticket = await config.gClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload(); // Get the payload
    console.log(payload)
    const checkUserId = await dbUser.checkUserId(payload['sub']); // Check DB for user

    if (checkUserId.status === 'exists') { // 1. User account exists
      const userRecord = await dbUser.getUserRecord(payload['sub']);
      if (userRecord.email !== payload['email'] || userRecord.name !== payload['name'] || userRecord.picture !== payload['picture']) {
        updateUserDetails(userRecord, payload);
      }
      req.session.userId = payload['sub']; // Set the users ID to their session
      return res.status(200).send("/main/dashboard");
    } else if (checkUserId.status === 'empty') { // 1. User account does not exist
      if (emailCheck.approved = 1) {
        const userDetails = { id: payload['sub'], email: payload['email'], name: payload['name'], picture: payload['picture'] };
        const result = await dbUser.createUser(userDetails);
      }
      req.session.userId = payload['sub'];
      console.log("NEW USER")
      return res.status(201).send("/main/dashboard");
    } else {
      res.redirect(400, '/');
    }
  } catch(e) {
    console.log(e);
    res.redirect(400, '/');
  }
});

async function updateUserDetails(userRecord, payload) {
  let updateDetails = { id: userRecord.id, email: userRecord.email, name: userRecord.name, picture: userRecord.picture }
  if (userRecord.email !== payload['email']) {
    updateDetails.email = payload['email'];
  }
  if (userRecord.name !== payload['name']) {
    updateDetails.name = payload['name'];
  }
  if (userRecord.picture !== payload['picture']) {
    updateDetails.picture = payload['picture'];
  }
  await dbUser.updateUserRecord(updateDetails);
};
