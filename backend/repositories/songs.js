var mongodb = require('mongodb');
var fs = require('fs');

function SongsRepository () {

//{'secteur':'amy','name':'guitare','songname':'meistersinger.mp3'}
  this.insertDocument = function(db, input, callback) {
    console.log('insertDocument');
    db.collection('songs').insertOne(input,
        function(err, result) {
            //assert.equal(err, null);
            console.log("Inserted a document into the songs collection.");
            callback(null, result);
        });
    };

  this.findRestaurants_by_field = function(db, domaine, content, callback) {
    var cursor = db.collection('songs').find( { domaine : content } );
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
