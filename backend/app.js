
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

/** TODO REMOVE **/
//var session = require('express-session');

//var routes = require('./routes/index');
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

app.get('/mix/:idMix', authMiddelware.ensureAuthorized, routess.feedbacks.getMix);
app.post('/comment', authMiddelware.ensureAuthorized, routess.feedbacks.postFeedback);
app.post('/mark', authMiddelware.ensureAuthorized, routess.feedbacks.postMark);
app.post('/search', authMiddelware.ensureAuthorized, routess.search.searchSongAndUser);

app.post('/follow',authMiddelware.ensureAuthorized,routess.follow.followSomeone);
app.get('/follow/followers/:idUser',routess.follow.getFollowers);
app.get('/follow/following/:idUser',routess.follow.getFollowing);
app.post('/unfollow',authMiddelware.ensureAuthorized,routess.follow.unfollow);

app.get('/manageMySongs/:idUser',authMiddelware.ensureAuthorized,routess.manageMySongs.getMySongs);
app.get('/manageMySongs/:idUser',authMiddelware.ensureAuthorized,routess.manageMySongs.getMySongs2);

app.get('/account/:idUser',authMiddelware.ensureAuthorized,routess.account.getAccountInfo);

//Functions previously used in index
app.post('/save',routess.manageMySongs.save);
app.post('/upload',routess.manageMySongs.upload);
app.post('/download',routess.manageMySongs.download);
app.get('/track',routess.manageMySongs.getTracks);
app.get('/track/:id',routess.manageMySongs.getTrackById);
app.post('/mixed',routess.manageMySongs.uploadMixed);
app.post('/savemixed',routess.manageMySongs.savemixed);
app.get('/getmixed',routess.manageMySongs.getMixed);
app.get('/getMixedSongInfo',routess.manageMySongs.getMixedSongInfo);
app.get('/folderName',routess.manageMySongs.getFolderName);
app.get('/get',routess.manageMySongs.getSongsByName);

var parth = /\/track\/(\w+)\/(?:sound|visualisation)\/((\w|.)+)/;
app.get(parth,routess.manageMySongs.uploadSongs);


//app.use('/', routes);
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
