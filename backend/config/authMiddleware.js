var jwt = require('jsonwebtoken');
var constants = require('../config/constants');

exports.ensureAuthorized = function(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== 'undefined') {

        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        jwt.verify(bearerToken, constants.JWT_SECRET, function(err, decoded) {
          if(err) {
            res.send(401);
            res.json({ status: constants.JSON_STATUS_SUCCESS,
              title: 'Connexion',
              message: 'You must be connected to make this operation !'
            });
            return;
          }
          req.token = decoded;
          next();
        });
    } else {
        res.send(401);
        res.json({ status: constants.JSON_STATUS_SUCCESS,
            title: 'Connexion',
            message: 'You must be connected to make this operation !'
        });
    }
};