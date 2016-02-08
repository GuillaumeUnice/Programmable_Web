var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var ObjectId = require("bson-objectid");

/**
 * get All mix of a specific user
 * @param  {Object} req Contains request data
 * @param  {Object} res Contains respond data
 * @return {Array}     Return Array of songs document register in 'songs collection'
 */
exports.getMySongs = function(req,res){
    songsRepository.findSongs_by_user(req.db,ObjectId(req.params.idUser),function(data){
        res.send(data);
    },function(code,msg){
        res.send(code,msg);
    })
};

exports.getMySongs2 = function(req,res){
    usersRepository.findUserById(req.db,ObjectId(req.params.idUser),function(data){
        res.send(data.songs);
    },function(code,msg){
        res.send(code,msg);
    })
};