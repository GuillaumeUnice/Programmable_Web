var express = require('express');
var router = express.Router();

var constants = require('../config/constants');
var utils = require('../config/utils');

var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

// module authentification
var jwt = require('jsonwebtoken');
var jwtMid = require('express-jwt');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10); // salage

/**********************************************************************************
 * 					  Middleware ➜ to use for all requests
 **********************************************************************************/
router.use(function(req, res, next) {
  console.log('Middleware called.');
  // allows requests fromt angularJS frontend applications
  /*res.header("Access-Control-Allow-Origin", "*");
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


/* GET home page. */
router.get('/', function(req, res, next) {

  /*songsRepository.downloadSong(req.db, 'meistersinger2.mp3', function(err, result) {
    console.log("OKKKK");
  });*/
  songsRepository.insertDocument(req.db, {name :req.body.name}, function(err, result) {
    if(err) {
      console.log(err);
      res.status(404);
      res.json({ status: constants.JSON_STATUS_ERROR,
        title: 'Erreur Système',
        message: 'Une erreur inattendu c\'est produit! Veuillez contacter l\'administrateur'});
      return;
    }

    // verify if correct password thank to BCrypt Hash
    // resCompare = true if same password else false
    if(utils.isEmpty(result)) {
      res.status(201);
      res.json({ status: constants.JSON_STATUS_ERROR,
        title: 'Erreur connexion',
        message: 'L\'utilisateur n\'existe pas! Email incorrect!'});
    } else {

    }
  });
  res.render('index', { title: 'Express' });

});



router.post('/test', jwtMid({secret: constants.JWT_SECRET}), function(req, res) {
  console.log("test");
  res.json({ status: constants.JSON_STATUS_SUCCESS,
    title: 'Connexion',
    message: 'Vous êtes déconnecté!'});
});


router.route('/save')
  .post(function(req, res) {
    songsRepository.insertDocument(req.db, {name :req.body.name}, function(err, result) {
      if(err) {
        console.log(err);
        res.status(404);
        res.json({ status: constants.JSON_STATUS_ERROR,
          title: 'Erreur Système',
          message: 'Une erreur inattendu c\'est produit! Veuillez contacter l\'administrateur'});
        return;
      }

      // verify if correct password thank to BCrypt Hash
      // resCompare = true if same password else false
      if(utils.isEmpty(result)) {
        res.status(201);
        res.json({ status: constants.JSON_STATUS_ERROR,
          title: 'Erreur connexion',
          message: 'L\'utilisateur n\'existe pas! Email incorrect!'});
      } else {
        res.status(201);
        res.json({ status: constants.JSON_STATUS_SUCCESS,
          title: 'Connexion',
          message: 'Un compte avec cette email existe déjà!'});
      }
    });
  });
//app.post('/upload',songsRepository.uploadSong);
router.route('/upload')
  .post(function(req, res) {
    //console.log( req.files.file.name);
    songsRepository.uploadSong(req,res, function(err, result) {
      if(err) {
        console.log(err);
        res.status(404);
        res.json({ status: constants.JSON_STATUS_ERROR,
          title: 'Erreur Système',
          message: 'Une erreur inattendu c\'est produit! Veuillez contacter l\'administrateur'});
        return;
      }

      // verify if correct password thank to BCrypt Hash
      // resCompare = true if same password else false
      if(utils.isEmpty(result)) {
        res.status(201);
        res.json({ status: constants.JSON_STATUS_ERROR,
          title: 'Erreur connexion',
          message: 'L\'utilisateur n\'existe pas! Email incorrect!'});
      } else {
        res.status(201);
        res.json({ status: constants.JSON_STATUS_SUCCESS,
          title: 'Connexion',
          message: 'Un compte avec cette email existe déjà!'});
      }
    });
  });

router.route('/download')
  .post(function(req, res) {

    songsRepository.downloadSong(req.db, req.body.name, function(err, result) {
      if(err) {
        console.log(err);
        res.status(404);
        res.json({ status: constants.JSON_STATUS_ERROR,
          title: 'Erreur Système',
          message: 'Une erreur inattendu c\'est produit! Veuillez contacter l\'administrateur'});
        return;
      }

      // verify if correct password thank to BCrypt Hash
      // resCompare = true if same password else false
      if(utils.isEmpty(result)) {
        res.status(201);
        res.json({ status: constants.JSON_STATUS_ERROR,
          title: 'Erreur connexion',
          message: 'L\'utilisateur n\'existe pas! Email incorrect!'});
      } else {
        res.status(201);
        res.json({ status: constants.JSON_STATUS_SUCCESS,
          title: 'Connexion',
          message: 'Un compte avec cette email existe déjà!'});
      }
    });
  });

module.exports = router;
