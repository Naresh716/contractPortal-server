const express = require('express')
const routerCtrl = express.Router()
const mongoose = require('mongoose');
const passport = require('passport');
const { LocalStorage } = require('node-localstorage')
const localStorage = new LocalStorage('./scratch')
routerCtrl.authenticate = (req, res, next) => {
    //call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return res.status(400).json(err);
        else if (user) {
            localStorage.setItem('token', user.generateJWT());
            return res.status(200).json({ "token": localStorage.getItem('token') });
        }
        else
            return res.status(404).json(info);
    })(req, res)
}

module.exports = routerCtrl;