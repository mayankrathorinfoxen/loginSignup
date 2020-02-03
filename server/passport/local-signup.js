const User = require('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, async (req, email, password, done) => {

    try {
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const userData = {
            email: email.trim(),
            password: hashedPassword,
            name: req.body.name.trim()
        }; 
        const newUser = new User(userData);
        const result = await newUser.save();
        console.log(result);
        return done(null);
    }
    catch(err) {
        return done(err);   
    }  
});
