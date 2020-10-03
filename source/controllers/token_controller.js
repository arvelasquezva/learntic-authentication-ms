"use strict";
const Token = require("../models/token_model");
const Service = require("../service/index");

function tokenI(req, res) {
    Token.findOne({ token: req.body.token }, (err, account) => {
        if (err) return res.status(500).send({ message: `error: ${err}` });
        if (!account)
            return res.status(404).send({ message: "no existe el token" });
        else {
            return res.status(201).send({ message: "Existe el token" });
        }
    });
}

module.exports = {
    tokenI,
};