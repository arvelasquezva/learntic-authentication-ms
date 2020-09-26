'use strict'
const express = require('express');
const api = express.Router();
const accountCtrl = require('../controllers/account_controller');


api.post('/singUp', accountCtrl.singUp);
api.post('/singIn', accountCtrl.singIn);

//api.post('/singOut', accountCtrl.singOut);

module.exports = api