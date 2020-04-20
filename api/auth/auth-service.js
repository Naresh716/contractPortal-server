const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const { User } = require('../../api/user/user-model');
passport.use(
    new localStrategy({ usernameField: 'userName' }, (username, password, done) => {
        User.findOne({ userName: username },
            (err, user) => {
                if (err)
                    return done(err);
                else if (!user)
                    return done(null, false, { message: "Username is not registered" });
                else if (!user.verifyPassword(password))
                    return done(null, false, { message: "Wrong password" });
                else
                    return done(null, user);
            })
    })
)