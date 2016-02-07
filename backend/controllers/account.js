var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var ObjectId = require("bson-objectid");

exports.getAccountInfo = function(req,res){
    var idUser = ObjectId(req.params.idUser);
    usersRepository.findUserById(req.db,idUser,function(result){
        res.send(result);
    },function(code,msg){
        res.send(code,msg);
    })
};
