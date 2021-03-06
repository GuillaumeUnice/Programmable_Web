var constants = require('../config/constants');
var utils = require('../config/utils');

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

/**
 * search elements, either user or song, which names are composed of at least one of the keywords
 * This is an insensitive case search
 */
exports.searchSongAndUser = function(req, res) {

	var result = {users:[],songs:[]};
	songsRepository.searchSongs_by_keywords(req.db,req.body.keywords,function(data){
		result.songs = data;
		usersRepository.searchUserByKeywords(req.db,req.body.keywords,function(info){
			result.users = info;
			res.send(result);
		})
	});

};