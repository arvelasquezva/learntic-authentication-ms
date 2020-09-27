'use strict'
const express = require('express');
const api = express.Router();
const accountCtrl = require('../controllers/account_controller');


api.post('/signUp', accountCtrl.signUp);
api.post('/signIn', accountCtrl.signIn);

//api.post('/singOut', accountCtrl.singOut);

module.exports = api;