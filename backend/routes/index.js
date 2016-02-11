var express = require('express');
var router = express.Router();

var authMiddelware = require('../config/authMiddleware');

var routes = {};
routes.auth = require('../controllers/auth.js');
routes.search = require('../controllers/search.js');
routes.feedbacks = require('../controllers/feedbacks.js');
routes.follow = require('../controllers/follow.js');
routes.manageMySongs = require('../controllers/manageMySongs.js');
routes.account = require('../controllers/account.js');

router.post('/register', routes.auth.register);
router.post('/login', routes.auth.login);
router.post('/logout', routes.auth.logout);

router.get('/feedbacks/:idSong', routes.feedbacks.getFeedbacks);

router.get('/mix/:idMix'/*, authMiddelware.ensureAuthorized*/, routes.feedbacks.getMix);
router.post('/comment', authMiddelware.ensureAuthorized, routes.feedbacks.postFeedback);
router.post('/mark', authMiddelware.ensureAuthorized, routes.feedbacks.postMark);
router.post('/search', authMiddelware.ensureAuthorized, routes.search.searchSongAndUser);

router.post('/follow',authMiddelware.ensureAuthorized,routes.follow.followSomeone);
router.get('/follow/followers/:idUser',routes.follow.getFollowers);
router.get('/follow/following/:idUser',routes.follow.getFollowing);
router.post('/unfollow',authMiddelware.ensureAuthorized,routes.follow.unfollow);

router.get('/manageMySongs/:idUser',authMiddelware.ensureAuthorized,routes.manageMySongs.getMySongs);
router.get('/manageMySongs/:idUser',authMiddelware.ensureAuthorized,routes.manageMySongs.getMySongs2);

router.get('/account/:idUser',authMiddelware.ensureAuthorized,routes.account.getAccountInfo);

//Functions previously used in index
router.post('/save',routes.manageMySongs.save);
router.post('/upload',routes.manageMySongs.upload);
router.post('/download',routes.manageMySongs.download);
router.get('/track',routes.manageMySongs.getTracks);
router.get('/track/:id',routes.manageMySongs.getTrackById);
router.post('/mixed',routes.manageMySongs.uploadMixed);
router.post('/savemixed',routes.manageMySongs.savemixed);
router.get('/getmixed',routes.manageMySongs.getMixed);
router.get('/getMixedSongInfo',routes.manageMySongs.getMixedSongInfo);
router.get('/folderName',routes.manageMySongs.getFolderName);
router.get('/get',routes.manageMySongs.getSongsByName);

var parth = /\/track\/(\w+)\/(?:sound|visualisation)\/((\w|.)+)/;
router.get(parth,routes.manageMySongs.uploadSongs);


module.exports = router;
