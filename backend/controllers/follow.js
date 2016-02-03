var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

exports.followSomeone = function(req,res){
    var idUser = req.body.idUser;
    var idFollowed = req.body.idFollowed;
    req.db.collection("users").updateOne()
};