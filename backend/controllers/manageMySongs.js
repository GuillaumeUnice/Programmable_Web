var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var ObjectId = require("bson-objectid");

exports.getMySongs = function(req,res){
    songsRepository.findSongs_by_user(req.db,ObjectId(req.params.idUser),function(data){
        res.send(data);
    },function(code,msg){
        res.send(code,msg);
    })
};