
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');

var jwt = require('jsonwebtoken');
var constants = require('./config/constants');
var authMiddelware = require('./config/authMiddleware');

/** TODO ADD **/
//var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users');
//var feedbacks = require('./routes/feedbacks');
//var search = require('./routes/search');

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
var routess = {};
routess.auth = require('./controllers/auth.js');
routess.search = require('./controllers/search.js');
routess.feedbacks = require('./controllers/feedbacks.js');
routess.follow = require('./controllers/follow.js');
routess.manageMySongs = require('./controllers/manageMySongs.js');
routess.account = require('./controllers/account.js');


app.use(function(req, res, next) {
  console.log('Middleware called.');
  // allows requests fromt angularJS frontend applications
 /* res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(); // go to the next route*/

  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});


/**********************************************************************************
 *                Route for auth API
 **********************************************************************************/
app.post('/register', routess.auth.register);
app.post('/login', routess.auth.login);
app.post('/logout', routess.auth.logout);

app.get('/feedbacks/:idSong', routess.feedbacks.getFeedbacks);

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    //console.log(jwt.decode(bearerHeader));
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        jwt.verify(bearerToken, constants.JWT_SECRET, function(err, decoded) {
          if(err) {
            res.send(401);
            return;
          }
          req.token = decoded;
          console.log(req.token);
          next();
        });
    } else {
        res.send(401);
    }
}

app.get('/mix', ensureAuthorized, routess.feedbacks.getMix);
app.post('/comment', ensureAuthorized, routess.feedbacks.postFeedback);
app.post('/mark', ensureAuthorized, routess.feedbacks.postMark);
app.post('/search', ensureAuthorized, routess.search.searchSongAndUser);

app.post('/follow',routess.follow.followSomeone);
app.get('/follow/followers/:idUser',routess.follow.getFollowers);
app.get('/follow/following/:idUser',routess.follow.getFollowing);
app.post('/unfollow/',routess.follow.unfollow);

app.get('/manageMySongs/:idUser',routess.manageMySongs.findMySongs);

app.get('/account/:idUser',routess.account.getAccountInfo);


app.use('/', routes);
//app.use('/users', users);
//app.use('/feedbacks', feedbacks);
//app.use('/search', search);

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
