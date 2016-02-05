var mongodb = require('mongodb');


var mime = require('mime');

var fs = require('fs');       //File System - for file manipulation


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

  this.findSongs_by_field = function(db, findby, content, callback) {
    var cursor = db.collection('songs').find( { name : content } );
    var i =0;
    cursor.each(function(err, doc) {
       //assert.equal(err, null);
      console.log(i++);
       if (doc !== null) {
          console.log(doc);
          callback(null,doc);
       } else {
          console.log("not found in the DB");
       }
    });
 };

    //Pre-condition : creation des indexes dans la BD
    this.searchSongs_by_keywords = function(db,keywords,callback) {
        var cursor = db.collection('songs').find({ name: { $regex: keywords }  } );
        var result = [];
        cursor.each(function(err, doc) {
            if (doc != null) {
                result.push(doc)
            }
            else{
                callback(result);
            }
        });
    };

  this.update_AddInDocument = function(db, findby, input, callback) {
    console.log('updateDocument');
    db.collection('songs').update(findby,{$pushAll:input},
      function(err, result) {
        //assert.equal(err, null);
        console.log("Add in document in the songs collection.");
        callback(null, result);
      });
  };

  this.update_ChangeInDocument = function(db, findby, change, callback) {
    console.log('updateDocument');
    db.collection('songs').update(findby,{$set:change},
      function(err, result) {
        //assert.equal(err, null);
        console.log("Change in document in the songs collection.");
        callback(null, result);
      });
  };

  this.update_RemoveInDocument = function(db, findby, remove, callback) {
    console.log('updateDocument');
    db.collection('songs').update(findby,{$unset:remove},
      function(err, result) {
        //assert.equal(err, null);
        console.log("remove from a document in the songs collection.");
        callback(null, result);
      });
  };

  this.uploadSong = function(req,res,callback) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      console.log("Uploading: " + filename);

      //Path where image will be uploaded  '/home/user/Bureau/programClient/Programmable_Web/backend'
      fstream = fs.createWriteStream(__dirname + '/../Musics/' + filename);
      file.pipe(fstream);
      fstream.on('close', function () {
        console.log("Upload Finished of " + filename);
        //res.redirect('back');           //where to go next
        callback(null, { success: true });
      });
    });

  };


  this.downloadSong = function(db, song_name, callback) {
    var bucket = new mongodb.GridFSBucket(db);
    console.log("1");
    bucket.openDownloadStreamByName('meistersinger.mp3').
    pipe(fs.createWriteStream('./output.mp3')).
    on('error', function(error) {
      assert.ifError(error);
    }).
    on('finish', function() {
      console.log('done!');
      process.exit(0);
    });console.log("2");
    callback(null,'ok');
  };

  this.getTracks = function (callback) {
    getFiles(__dirname + '/../Musics/', callback);
  };

  this.getTrack = function (id, callback) {
    getFiles(__dirname + '/../Musics/' + id, function(fileNames) {
      var track = {
        id: id,
        instruments: []
      };
      fileNames.sort();
      for (var i = 0; i < fileNames.length; i += 2) {
        var instrument = fileNames[i].match(/(.*)\.[^.]+$/, '')[1];
        track.instruments.push({
          name: instrument,
          sound: instrument + '.mp3',
          visualisation: instrument + '.png'
        });
      }
      callback(track);
    })
  };

  function getFiles(dirName, callback) {
    fs.readdir(dirName, function(error, directoryObject) {
      callback(directoryObject);
    });
  };

  this.uploadMixed = function(req,res,callback) {
    var fstream;
    console.log('0');
    req.pipe(req.busboy);
    console.log('1');
      //Path where image will be uploaded  '/home/user/Bureau/programClient/Programmable_Web/backend'
    /*  fstream = fs.createWriteStream(__dirname + '/../Musics/' +'kk.mp3');
    console.log('queue'+req.body);
    //var blob = new Blob([req.xhr], {type: 'audio/mp3'});
    req.body.pipe(fstream);

      fstream.on('close', function () {
        //console.log("Upload Finished of " + filename);
        //res.redirect('back');           //where to go next
        callback(null, { success: true });
      });*/
    req.busboy.on('file', function (fieldname, file, filename) {
      console.log('2');
      console.log("Uploading: " + filename);

      //Path where image will be uploaded  '/home/user/Bureau/programClient/Programmable_Web/backend'
      fstream = fs.createWriteStream(__dirname + '/../Musics/' + filename);
      file.pipe(fstream);
      fstream.on('close', function () {
        console.log("Upload Finished of " + filename);
        //res.redirect('back');           //where to go next
        callback(null, { success: true });
      });
    });

  };

    this.getFeedbacks = function(db,idSong,successCB,errorCB){
        db.collection('songs').findOne({"_id" : idSong },function(err,result){
            if(err){
                errorCB();
            }else successCB(result.feedbacks);
        });
    };

    this.postFeedback = function(db,idSong,newFeedback){
        db.collection('songs').updateOne({"_id" : idSong },{ $push: { "feedbacks": newFeedback } });
    }

};

exports.SongsRepository = SongsRepository;
