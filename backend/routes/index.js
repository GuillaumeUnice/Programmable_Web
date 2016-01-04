var express = require('express');
var router = express.Router();

var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();


/**********************************************************************************
 * 					  Middleware ➜ to use for all requests
 **********************************************************************************/
router.use(function(req, res, next) {
    console.log('Middleware called.');
    // allows requests fromt angularJS frontend applications
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(); // go to the next route
});


/* GET home page. */
router.get('/', function(req, res, next) {
	//console.log(songsRepository.insertDocument.toString());
	songsRepository.downloadSong(req.db,'basse.mp3', function(err, result) {
	//songsRepository.uploadSong(req.db,'./basse.mp3', function(err, result) {

		console.log("OKKKK");
	});
  /*req.db.collection('songs').insertOne({'secteur':'kkk','name':'guitarekk','songname':'meistersinger.mp3'},
        function(err, result) {
            //assert.equal(err, null);
            

            console.log("Inserted a document into the songs collection.");
            //callback(result);
        });
*/
  res.render('index', { title: 'Express' });

});

module.exports = router;
