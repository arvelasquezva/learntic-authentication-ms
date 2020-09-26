"use strict";
const Account = require("../models/account_model");
const Service = require("../service/index");

function singUp(req, res) {
    const account = new Account({
        nickName: req.body.nickName,
        password: req.body.password,
    });

    account.save((err) => {
        if (err)
            return res
                .status(500)
                .send({ message: `error al crear el usuario ${err}` });
        res.status(201).send({
            nickName: account.nickName,
            token: Service.createToken(account),
        });
    });
}

function singIn(req, res) {
    Account.findOne({ nickName: req.body.nickName }, (err, account) => {
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
                nickName: account.nickName,
                token: Service.createToken(account),
            });
        });
    });
}

module.exports = {
    singIn,
    singUp,
};