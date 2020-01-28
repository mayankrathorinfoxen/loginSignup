const passport = require('passport');
const { ErrorTypes } = require('../../main/common/errors');
const { validations } = require('../../config/index');
const logger = require('../../main/common/logger');


// POST /auth/signup
exports.postSignup = function(req, res, next) {
    const validationResult = validateSignupForm(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }
    return passport.authenticate('local-signup', (err) => {
      if (err) {
  
        if (err.name === 'MongoError' && err.code === 11000) {
          // 11000 Mongo code is for a duplicate key e.g. email
          logger.info(`/signup, duplicate email,${req.body.email}`);
  
          // 409 HTTP status code is for conflict error
          return res.status(409).json({
            success: false,
            message: 'Check the form for errors.',
            errors: {
              email: 'This email is already taken.'
            }
          });
        } else {
          logger.error(err);
        }
  
        return res.status(400).json({
          success: false,
          message: 'Could not process the form.'
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Sign up success.'
      });
    })(req, res, next);
  };

  // POST /auth/login
exports.postLogin = function(req, res, next) {
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {
      if (err.name === ErrorTypes.IncorrectCredentials) {
        logger.info(`/login, incorrect email or password,${req.body.email}`);

        return res.status(400).json({
          success: false,
          message: err.message
        });
      } else if (err.name === ErrorTypes.NotAuthorized) {
        logger.info(err);

        return res.status(401).json({
          success: false,
          message: 'Not Authorized'
        });
      } else {
        logger.error(err);
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    return res.json({
      success: true,
      message: 'Login success.',
      token,
      user: userData
    });
  })(req, res, next);
};



/**
 * Validate the sign up form
 *
 * @param   {object} body The HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(body) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!body || typeof body.email !== 'string' ||
      !(validations.email.regex.value).test(body.email.trim())) {
    isFormValid = false;
    errors.email = validations.email.regex.message;
  }

  if (!body || typeof body.password !== 'string' ||
      body.password.trim().length < validations.password.minLength.value) {
    isFormValid = false;
    errors.password = validations.password.minLength.message;
  }

  if (!body || typeof body.name !== 'string' || body.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param   {object} body The HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(body) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!body || typeof body.email !== 'string' ||
      !(validations.email.regex.value).test(body.email.trim())) {
    isFormValid = false;
    errors.email = validations.email.regex.message;
  }

  if (!body || typeof body.password !== 'string' ||
      body.password.trim().length < validations.password.minLength.value) {
    isFormValid = false;
    errors.password = validations.password.minLength.message;
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}
