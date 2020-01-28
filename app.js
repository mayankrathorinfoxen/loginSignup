const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 7000;
const passport = require('passport');
const config = require('./server/config/index');
const logger = require('./server/main/common/logger');

// Connect to the database and load models
require('./server/models/index').connect(config.dbUri);

const app = express();
const http = require('http').createServer(app);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// // Define routes
app.use('/auth', require('./server/routes/auth'));


// Error handler
app.use(function(err, req, res) {

  logger.error(err);

  // set locals,  only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Listen on provided port, on all network interfaces.
 */
http.listen(port);
logger.info('Server started on port ' + port);