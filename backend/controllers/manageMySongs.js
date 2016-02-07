var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var ObjectId = require("bson-objectid");

exports.getMySongs = function(req,res){
    usersRepository.findUserById(req.db,ObjectId(req.params.idUser),function(data){
        res.send(data.songs);
    },function(code,msg){
        res.send(code,msg);
    })
};

exports.postMySong = function(req,res){
    var song = {name: "Mon nouveau mix", created_at : new Date().getTime()};
    usersRepository.addSong(req.db,ObjectId(req.params.idUser),song,function(data){
        res.send("C'est fait");
    },function(code,msg){
        res.send(code,msg);
    })
};