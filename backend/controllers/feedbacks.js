var constants = require('../config/constants');
var utils = require('../config/utils');

var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

exports.getFeedbacks = function(req, res) {
	var idSong = req.params.idSong;
	songsRepository.getFeedbacks(req.db,idSong,function(data){
		res.send(data);
	},function(){
		res.send(404,'This song doesn\'t exist');
	})
};

exports.postFeedback = function(req, res) {
	var newFeedback = { user: req.body.user, mark: +req.body.mark, comment: req.body.comment};
	var idSong = req.params.idSong;
	songsRepository.postFeedback(req.db,idSong,newFeedback,function(){
		res.send(500,'The format of the message is wrong')
	});
	res.send("Feedback added!");
};