/**
 * Created by sy306571 on 04/01/16.
 */
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

/* GET marks listing. */
router.get('/feedback', function(req, res, next) {
    res.send('Bonjour');
});

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    db.close();
});



module.exports = router;