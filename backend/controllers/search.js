var constants = require('../config/constants');
var utils = require('../config/utils');

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

exports.searchSongAndUser = function(req, res) {
	req.db.collection("songs").createIndex( { name : "text" } );
	req.db.collection("users").createIndex( { full_name : "text" } );
	//Il faudrait mettre la creation des index en amont. Ou ? Telle est la question

	var result = {users:[],songs:[]};
	songsRepository.searchSongs_by_keywords(req.db,req.body.keywords,function(data){
		result.songs = data;
		usersRepository.searchUserByKeywords(req.db,req.body.keywords,function(info){
			result.users = info;
			res.send(result);
		})
	});

};