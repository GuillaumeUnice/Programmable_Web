
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

var utils = require('./config/utils');

var jwt = require('jsonwebtoken');
var authMiddelware = require('./config/authMiddleware');

var jwtMid = require('express-jwt');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var app = express();app.use(busboy());

var constants = require('./config/constants');

var expressMongoDb = require('express-mongo-db');

if (app.get('env') === 'production') {
 app.use(expressMongoDb(constants.MONGO_URL_PROD_DB)); // DB connection
} else {
  app.use(expressMongoDb(constants.MONGO_URL_TEST_DB)); // DB connection  
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // TODO change tot true
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** TODO ADD **/
/*app.use(session({
  secret: 'ceciestunsercretesfefefeffe',  // session secret
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));*/


//Routes
var routes = require('./routes/index.js');


app.use(function(req, res, next) {
  console.log('Middleware called.');
  // allows requests fromt angularJS frontend applications
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
