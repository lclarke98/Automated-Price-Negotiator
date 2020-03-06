const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../../config.js');
const mw = require('../../middleware.js');

const main = express.Router();

module.exports = main;

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: true }));
main.use(session(config.cookie));

// Missing middlewares for checks

main.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../', 'src/html/index.html'));
});

main.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../', 'src/html/dashboard.html'));
});
