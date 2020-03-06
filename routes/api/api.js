const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../../config.js');
const dbUser = require('../../db/db-user.js');

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