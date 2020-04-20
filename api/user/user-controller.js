const express = require('express')
const routerCtrl = express.Router()
const { User } = require('../../api/user/user-model')
const mongoose = require('mongoose');
const _ = require('lodash');
// user registration
routerCtrl.register = async (req, res, next) => {
    console.log('inside register user user');
    console.log(req.body);
    try {
        var user = new User();
        user.userName = req.body.userName;
        user.email = req.body.email;
        user.password = req.body.password;
        user.displayName = req.body.displayName;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.nickName = req.body.nickName;
        user.website = req.body.website;
        user.bio = req.body.bio;
        user.jabber = req.body.jabber;
        user.aol_im = req.body.aol_im;
        user.yahoo_im = req.body.yahoo_im;
        user.save((err, doc) => {
            if (!err) {
                console.log(doc);
                res.send(doc);
            }
            else {
                console.log(err);
            }
        });
    } catch (error) {
        console.log(error);
    }
}


//get users details
routerCtrl.getUserDetails = async (req, res, next) => {
    console.log('inside get user');
    try {
        var all = [];
        for await (const doc of User.find()) {
            all.push(doc);
        }
        res.send(all);
    } catch (error) {

    }
}
routerCtrl.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: "User record not found" });
            else
                return res.status(200).json({ status: true, user: _.pick(user, ['userName', 'email', 'firstName', 'lastName']) });
        })
}

routerCtrl.checkUserExists = async (req) => {
    let userExist = await User.findOne({ email: req.body.email }).then((s) => { return s; })
        .catch((e) => console.log(e));
    if (userExist) return { success: true, statusCode: 'INVALID_DATA', message: ' User already exist with the provided email address.' };
    return { success: false };
}
module.exports = routerCtrl