"use strict";
var FormData = require("form-data");
var querystring = require('querystring');
const Account = require("../models/account_model");
const Service = require("../service/index");
const axios = require("axios");

async function signUp(req, res) {
    let account = new Account({
        username: req.body.username,
        password: req.body.password,
        uid: ""
    });

    await axios.post("http://34.205.114.201:8081/users", querystring.stringify({
            username: account.username
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then((res) => {
            account.uid = res.data.uid;
        })
        .catch((err) => {
            console.log("Esto es un error", err);
        });
    account.save((err) => {
        if (err)
            return res
                .status(500)
                .send({ message: `error al crear el usuario ${err}` });
        res.status(201).send({
            username: account.username,
            token: Service.createToken(account),
            uid: account.uid
        });
    });
}

function signIn(req, res) {
    Account.findOne({ username: req.body.username }, (err, account) => {
        if (err) return res.status(500).send({ message: `error: ${err}` });
        if (!account)
            return res.status(404).send({ message: "no existe la cuenta" });

        account.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return res.status(500).send({ error: `${err}` });
            if (!isMatch)
                return res
                    .status(404)
                    .send({ message: `datos incorrectos/ contraseña erronea` });

            req.account = account;
            res.status(200).send({
                username: account.username,
                token: Service.createToken(account),
                uid: account.uid
            });
        });
    });
}

function authorization(req, res) {
    const token = req.body.token;
    Service.decodeToken(token)
        .then((response) => {
            req.account = response;
            res.status(200).send({
                authorization: true,
                message: "estas autorizado",
            });
        })
        .catch((response) => {
            res.status(200).send({
                authorization: false,
                message: response.message,
            });
        });
}

module.exports = {
    signIn,
    signUp,
    authorization,
};