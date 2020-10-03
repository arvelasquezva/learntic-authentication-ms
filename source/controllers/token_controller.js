"use strict";
const Token = require("../models/token_model");
const Service = require("../service/index");

function tokenI(req, res, next) {
    const token = req.token;
    Service.decodeToken(token)
        .then(response => {
            req.account = response
            res.status(200).send({
                authorization: true,
                message: 'estas autorizado'
            })
        })
        .catch(response => {
            res.status(response.status).send({
                authorization: false,
                message: response.message
            })
        })
}

module.exports = {
    tokenI,
};