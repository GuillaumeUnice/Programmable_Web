/**
 * Created by sy306571 on 04/01/16.
 */
var express = require('express');
var router = express.Router();

/* GET marks listing. */
router.get('/', function(req, res, next) {
    var mixes = req.db.collection('mixes').find();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(mixes));
    res.send();
});

router.post('/:newMixes', function(req, res, next) {
    var newMixes = req.params.newMixes;
    res.send('Bonjour');
});

module.exports = router;