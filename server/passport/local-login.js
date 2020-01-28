const jwt = require('jsonwebtoken');
const User = require('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config/index');
const {
  ErrorTypes,
  NotAuthorizedError,
  IncorrectCredentialsError } = require('../main/common/errors');


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
    password: password.trim()
  };

  // Find a user by email address
    try {
        const user = await User.findOne(userData);
        if(!user) {
            return done(new IncorrectCredentialsError('Incorrect email or password'));
         }
          const payload = {
            sub: user._id
          };
      
          // create a token string
          const token = jwt.sign(payload, config.jwtSecret);
          const data = {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
            };
    
        return done(null, token, data);
    }
    catch(err) {
        return done(err);
    }
});