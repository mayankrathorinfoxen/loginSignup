const User = require('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, async (req, email, password, done) => {

    const userData = {
        email: email.trim(),
        password: password.trim(),
        name: req.body.name.trim()
    };

    const newUser = new User(userData);
    try{
        const result = await newUser.save();
        console.log(result);
        return done(null);
    }  
    catch(err) {
        return done(err);
    }  
});
