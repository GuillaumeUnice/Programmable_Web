var express = require('express');
var router = express.Router();
var path = require('path');
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

        // verify if correct password thanks to BCrypt Hash
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
    usersRepository.findUserByPseudo(req.db, req.body.email, function (err, result) {
      if (err) {
        console.log(err);
        res.status(404);
        res.json({
          status: constants.JSON_STATUS_ERROR,
          title: 'Erreur Système',
          message: 'Une erreur inattendu c\'est produit! Veuillez contacter l\'administrateur'
        });
        return;
      }
      console.log(result);
      if (utils.isEmpty(result)) {
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        usersRepository.addUser(req.db, req.body, function (err, result) {
          if (err) {
            console.log(err);
            res.status(404);
            res.json({
              status: constants.JSON_STATUS_ERROR,
              title: 'Erreur Système',
              message: 'Une erreur inattendu c\'est produit! Veuillez contacter l\'administrateur'
            });
            return;
          }
          res.status(201);
          res.json({
            status: constants.JSON_STATUS_SUCCESS,
            title: 'Connexion',
            message: 'Vous êtes à présent inscris!'
          });
        });
      } else {
        res.status(201);
        res.json({
          status: constants.JSON_STATUS_SUCCESS,
          title: 'Connexion',
          message: 'Un compte avec cette email existe déjà!'
        });
      }
    });
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

router.route('/get')
  .get(function(req, res) {
    console.log('find'+req.query.name_find);
    songsRepository.findSongs_by_field(req.db, 'name' ,req.query.name_find, function(err, result) {
      //console.log(req.session.emailUser);
      res.json({ status: constants.JSON_STATUS_SUCCESS,
        title: 'Connexion',
        message: result});
    });
  });

var parth = /\/track\/(\w+)\/(?:sound|visualisation)\/((\w|.)+)/;

router.route(parth)
  .get(function(req, res) {
    var id = req.params[0];
    console.log('send songs');
    console.log('kk'+req.params[0] + '/' + req.params[1]);
    console.log(__dirname + '/../Musics/' + req.params[0] + '/' + req.params[1]);
    res.sendfile(path.resolve(__dirname + '/../Musics/' + req.params[0] + '/' + req.params[1]));
  });


router.route('/track')
  .get(function(req, res) {
    songsRepository.getTracks(function(trackList) {
      if (!trackList)
        return res.send(404, 'No track found');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(trackList));
      res.end();
    });
    //res.sendfile(__dirname + '/../Musics/'  + req.params[0] + '/' + req.params[1]);
  });

router.route('/track/:id')
  .get(function(req, res) {
    var id = req.params.id;
    songsRepository.getTrack(id,function(track) {
      if (!track)
        return res.send(404, 'Track not found with id "' + id + '"');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(track));
      res.end();
    });
    //res.sendfile(__dirname + '/../Musics/'  + req.params[0] + '/' + req.params[1]);
  });

router.route('/mixed')
  .post(function(req, res) {
    //console.log( req.files.file.name);
    songsRepository.uploadMixed(req,res, function(err, result) {
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
