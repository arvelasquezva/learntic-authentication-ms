'use strict'
const express = require('express');
const api = express.Router();
const accountCtrl = require('../controllers/account_controller');
const tokenCtrl = require('../controllers/token_controller');


api.post('/signUp', accountCtrl.signUp);
api.post('/signIn', accountCtrl.signIn);
api.post('/auth', tokenCtrl.token, accountCtrl.authorization);

//api.post('/singOut', accountCtrl.singOut);

module.exports = api;