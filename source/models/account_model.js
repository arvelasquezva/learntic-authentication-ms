'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const AccountSchema = Schema({
    username: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    uid: {
        type: String
    }
});


AccountSchema.pre('save', function(next) {
    let account = this;
    if (!account.isModified('password')) return next()

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next()

        bcrypt.hash(account.password, salt, null, (err, hash) => {
            if (err) return next(err)

            account.password = hash;
            next();
        })
    })
})

AccountSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('usuarios', AccountSchema)