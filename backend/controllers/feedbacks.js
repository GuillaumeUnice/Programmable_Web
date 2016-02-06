var constants = require('../config/constants');
var utils = require('../config/utils');

var ObjectId = require("bson-objectid");

var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

exports.getFeedbacks = function(req, res) {
	var idSong = ObjectId(req.params.idSong);
	songsRepository.getFeedbacks(req.db,idSong,function(data){
		res.send(data);
	},function(code,msg){
		res.send(code,msg);
	})
};

exports.postFeedback = function(req, res) {
	var newFeedback = { user: req.body.user, mark: +req.body.mark, comment: req.body.comment};
	var idSong = ObjectId(req.params.idSong);
	songsRepository.postFeedback(req.db,idSong,newFeedback,function(msg) {
		res.send(msg);
	},function(code,msg){
			res.send(code,msg)
		}
	);
};