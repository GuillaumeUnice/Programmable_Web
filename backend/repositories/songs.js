var mongodb = require('mongodb');
var fs = require('fs');

function SongsRepository () {

  this.insertDocument = function(db, callback) {
    console.log('insertDocument');
    db.collection('songs').insertOne({'secteur':'amy','name':'guitare','songname':'meistersinger.mp3'},
        function(err, result) {
            //assert.equal(err, null);
            console.log("Inserted a document into the songs collection.");
            callback(null, result);
        });
    }; 

  this.findRestaurants_by_field = function(db, callback) {
    var cursor = db.collection('songs').find( { a: 2 } );
    cursor.each(function(err, doc) {
       //assert.equal(err, null);
       if (doc !== null) {
          console.log(doc._id, " in ", doc.a);
       } else {
          console.log("not found");
          callback();
       }
    });
 };

  this.uploadSong = function(db, url, callback) {
    var bucket = new mongodb.GridFSBucket(db);
      fs.createReadStream(url).
      pipe(bucket.openUploadStream('meistersinger.mp3')).
      on('error', function(error) {
        assert.ifError(error);
      }).
      on('finish', function() {
        console.log('done!');
        process.exit(0);
      });
      callback(null,'ok');
  };

  this.downloadSong = function(db, song_name, callback) {
    var bucket = new mongodb.GridFSBucket(db); 

    bucket.openDownloadStreamByName(song_name).
    pipe(fs.createWriteStream('./output.mp3')).
    on('error', function(error) {
      assert.ifError(error);
    }).
    on('finish', function() {
      console.log('done!');
      process.exit(0);
    });
    callback(null,'ok');
  };

};

exports.SongsRepository = SongsRepository;