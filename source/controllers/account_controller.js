"use strict";
var FormData = require("form-data");
var querystring = require('querystring');
const Account = require("../models/account_model");
const Service = require("../service/index");
const axios = require("axios");
const ldap = require("ldapjs");

var client = ldap.createClient({
    url: "ldap://3.222.180.111:389"
})

function addUserToLDAP(account, res) {
    return new Promise(function (resolve, reject) {
        client.bind('cn=admin,dc=arqsoft,dc=unal,dc=edu,dc=co', 'admin', function (err) {
            if (err) {
                reject(res
                    .status(500)
                    .send({ message: `Error de autenticacion en el LDAP, las modificaciones han de ser autenticadas` }));
            }
        })

        var entry = {
            sn: account.name,
            userPassword: account.password,
            objectclass: 'inetOrgPerson',
        };

        let dn = `cn=${account.username},ou=sa,dc=arqsoft,dc=unal,dc=edu,dc=co`
        client.add(dn, entry, function (err) {
            if (err) {
                reject(res
                    .status(400)
                    .send({ message: `Petición inválida - El registro ya existe (LDAP)` }));
            } else {
                resolve("LDAP verification done successfully")
            }
        });
    })
}

async function signUp(req, res) {
    let account = new Account({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        age: req.body.age,
        uid: "",
    });

    addUserToLDAP(account, res).then(async function () {
        await axios.post("http://34.234.23.19:8081/users", querystring.stringify({
            // await axios.post("http://34.205.114.201:8081/users", querystring.stringify({
            username: account.username,
            fullname: account.name,
            age: account.age
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
                    .send({ message: `Error al crear el usuario ${err}` });
            res.status(201).send({
                username: account.username,
                token: Service.createToken(account),
                uid: account.uid,
                name: account.name,
                age: account.age
            });
        });
    }).catch((err) => {
        return err;
    })

}

function signInLDAP(req, res) {
    return new Promise(function (resolve, reject) {
        client.bind(`cn=${req.body.username},ou=sa,dc=arqsoft,dc=unal,dc=edu,dc=co`, req.body.password, function (err) {
            if (err) {
                reject(res
                    .status(400)
                    .send({ message: `Credenciales invalidos (LDAP)` }));
            } else {
                resolve("LDAP sign-in done successfully")
            }
        })
    })
}

function signIn(req, res) {
    signInLDAP(req, res).then(() => {
        Account.findOne({ username: req.body.username }, (err, account) => {
            if (err) return res.status(500).send({ message: `error: ${err}` });
            if (!account)
                return res.status(404).send({ message: "No existe la cuenta" });
    
            account.comparePassword(req.body.password, (err, isMatch) => {
                if (err) return res.status(500).send({ error: `${err}` });
                if (!isMatch)
                    return res
                        .status(400)
                        .send({ message: `Datos incorrectos / contraseña erronea` });
    
                req.account = account;
                res.status(200).send({
                    username: account.username,
                    token: Service.createToken(account),
                    uid: account.uid,
                    name: account.name,
                    age: account.age
                });
            });
        });
    }).catch((err) => {
        return err
    })

}

function authorization(req, res) {
    const token = req.body.token;
    Service.decodeToken(token)
        .then((response) => {
            req.account = response;
            res.status(200).send({
                authorization: true,
                message: "Estas autorizado",
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