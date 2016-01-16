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
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10); // salage

/**********************************************************************************
 * 					  Middleware ➜ to use for all requests
 **********************************************************************************/
router.use(function(req, res, next) {
  console.log('Middleware called.');
  // allows requests fromt angularJS frontend applications
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next(); // go to the next route
});


/* GET home page. */
router.get('/', function(req, res, next) {

  songsRepository.uploadSong(req.db,'./meistersinger.mp3', function(err, result) {
    console.log("OKKKK");
  });
  res.render('index', { title: 'Express' });

});


/**********************************************************************************
 *                Route for auth API
 **********************************************************************************/
// TODO delete session
router.route('/logout')
  .get(function(req, res) {
    console.log(req.session.emailUser);
    res.json({ status: constants.JSON_STATUS_SUCCESS,
      title: 'Connexion',
      message: 'Vous êtes déconnecté!'});
  });

router.route('/login')

    .post(function(req, res) {
      console.log(req.body);
      usersRepository.findUserByPseudo(req.db, req.body.email, function(err, result) {
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
        
          bcrypt.compare(req.body.password, result.password, function(err, resCompare) { 
            if(err) {
              console.log(err);
              res.status(404);
              return;
            }
          
            if(resCompare) {
              var token = jwt.sign(result, constants.JWT_SECRET, { expiresInMinutes: 1/*60*5*/ });
              req.session.idUser = result._id;
              req.session.emailUser = result.email;
              //console.log(req.session);
              res.status(201);
              res.json({ status: constants.JSON_STATUS_SUCCESS,
                title: 'Connexion',
                message: 'Vous êtes à présent connecté!',
                token: token
              });
            } else {
              res.status(201);
              res.json({ status : constants.JSON_STATUS_ERROR,
                title: 'Erreur connexion',
                message: 'Le mot de passe est incorrect!'});  
            }
            
          });
        }
      });
    });
router.route('/auth/register')
  .post(function(req, res) {
    usersRepository.findUserByPseudo(req.db, req.body.email, function(err, result) {
      if(err) {
        console.log(err);
        res.status(404);
        res.json({ status: constants.JSON_STATUS_ERROR,
          title: 'Erreur Système',
          message: 'Une erreur inattendu c\'est produit! Veuillez contacter l\'administrateur'});
        return;
      }
      console.log(result);
      if(utils.isEmpty(result)) {
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        usersRepository.addUser(req.db, req.body, function(err, result) {
          if(err) {
            console.log(err);
            res.status(404);
            res.json({ status: constants.JSON_STATUS_ERROR,
              title: 'Erreur Système',
              message: 'Une erreur inattendu c\'est produit! Veuillez contacter l\'administrateur'});
            return;
          }
          res.status(201);
          res.json({ status: constants.JSON_STATUS_SUCCESS,
            title: 'Connexion',
            message: 'Vous êtes à présent inscris!'});
        });
      } else {
        res.status(201);
        res.json({ status: constants.JSON_STATUS_SUCCESS,
          title: 'Connexion',
          message: 'Un compte avec cette email existe déjà!'});
      }
    });

  });


module.exports = router;
