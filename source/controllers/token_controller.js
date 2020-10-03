"use strict";
const Token = require("../models/token_model");
const Service = require("../service/index");

function tokenI(req, res, next) {
    Token.findOne({ token: t }, (err, tokenF) => {
        if (err) return res.status(500).send({
            authorization: false,
            message: `internal server error ${err}`
        })
        if (tokenF) return res.status(401).send({
            authorization: false,
            message: 'token en blacklist'
        })
        next();
    });
}

module.exports = {
    tokenI,
};