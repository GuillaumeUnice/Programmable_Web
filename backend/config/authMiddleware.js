exports.ensureAuthorized = function(req, res, next) {
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
          next();
        });
    } else {
        res.send(401);
    }
};