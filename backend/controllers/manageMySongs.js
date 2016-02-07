var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

var ObjectId = require("bson-objectid");

exports.findMySongs = function(req,res){
    songsRepository.findSongs_by_user(req.db,ObjectId(req.params.idUser),function(data){
        res.send(data);
    },function(code,msg){
        res.send(code,msg);
    })
};