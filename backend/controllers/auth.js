var constants = require('../config/constants');
var utils = require('../config/utils');


var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

// module authentification
var jwt = require('jsonwebtoken');
var jwtMid = require('express-jwt');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10); // salage



exports.register = function(req, res) {
	usersRepository.findUserByPseudo(req.db, req.body.email, function(err, result) {
      if(err) {
        console.log(err);
        res.status(500);
        res.json({ status: constants.JSON_STATUS_ERROR,
          title: 'Erreur Système',
          message: 'Une erreur inattendue s\'est produite ! Veuillez contacter l\'administrateur'});
        return;
      }
      if(utils.isEmpty(result)) {
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        usersRepository.addUser(req.db, req.body, function(err, result) {
          if(err) {
            console.log(err);
            res.status(500);
            res.json({ status: constants.JSON_STATUS_ERROR,
              title: 'Erreur Système',
              message: 'Une erreur inattendue s\'est produite ! Veuillez contacter l\'administrateur'});
            return;
          }
          res.status(200);
          res.json({ status: constants.JSON_STATUS_SUCCESS,
            title: 'Connexion',
            message: 'Vous êtes à présent inscrit !'});
        });
      } else {
        res.status(403);
        res.json({ status: constants.JSON_STATUS_WARNING,
          title: 'Connexion',
          message: 'Un compte avec cet email existe déjà !'});
      }
    });
}; // end register()


exports.login = function(req, res) {
	usersRepository.findUserByPseudo(req.db, req.body.email, function(err, result) {
		if(err) {
		  console.log(err);
		  res.status(401);
		  res.json({ status: constants.JSON_STATUS_ERROR,
		    title: 'Erreur Système',
		    message: 'Une erreur inattendue s\'est produite ! Veuillez contacter l\'administrateur'});
		  return;
		}

		// verify if correct password thanks to BCrypt Hash
		// resCompare = true if same password else false
		if(utils.isEmpty(result)) {
		  res.status(401);
		  res.json({ status: constants.JSON_STATUS_ERROR,
		    title: 'Erreur connexion',
		    message: 'L\'utilisateur n\'existe pas ! Email incorrect !'});
		} else {

		  bcrypt.compare(req.body.password, result.password, function(err, resCompare) { 
		    if(err) {
		      console.log(err);
		      res.status(401);
		      return;
		    }
		  
		    if(resCompare) {
		      delete result.password;
		      var token = jwt.sign(result, constants.JWT_SECRET, { expiresInMinutes: 60 });
		      //console.log(token);

		      // TODO ADD
		      /*req.session.idUser = result._id;
		      req.session.emailUser = result.email;
		      */
		      //console.log(req.session);
		      
		      res.status(200);
		      res.json({ status: constants.JSON_STATUS_SUCCESS,
		        title: 'Connexion',
		        message: 'Vous êtes à présent connecté !',
		        data: result,
		        token: token
		      });
		    } else {
		      res.status(401);
		      res.json({ status : constants.JSON_STATUS_ERROR,
		        title: 'Erreur connexion',
		        message: 'Le mot de passe est incorrect !'});
		    }
		    
		  });
		}
	});
}; // end login()

var getToken = function(headers) {
	if (headers && headers.authorization) {
		var authorization = headers.authorization;
		var part = authorization.split(' ');

		if (part.length == 2) {
			var token = part[1];

			return part[1];
		}
		else {
			return null;
		}
	}
	else {
		return null;
	}
};

exports.logout = function(req, res) {
	//console.log(req.headers);
	//var token = getToken(req.headers);


	//console.log(req.user);

	//if (req.user) {
		//tokenManager.expireToken(req.headers);

		//delete req.user;	
		res.status(200);
		res.json({ status: constants.JSON_STATUS_SUCCESS,
      	title: 'Connexion',
      	message: 'Vous êtes déconnecté !'});
	/*}
	else {
		return res.send(401);
	}*/
}; // end logout()

