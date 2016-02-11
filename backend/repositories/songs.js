var mongodb = require('mongodb');


var mime = require('mime');

var fs = require('fs');       //File System - for file manipulation

var dirCount = "";
var ObjectID = require("bson-objectid");

function SongsRepository () {

//{'secteur':'amy','name':'guitare','songname':'meistersinger.mp3'}

  //add a data in the collection 'songs'
  this.insertDocument = function(db, input, callback) {
    db.collection('songs').insertOne(input,
        function(err, result) {
            console.log("Inserted a document into the songs collection.");
            callback(null, result);
        });
    };

    this.findSongs_by_user = function(db, idUser, successCB,errorCB) {
        db.collection('songs').find( { "author._id" : idUser },function(err,cursor){
            if(err){
                errorCB(500,'Error!');
            }
            else{
                var result = [];
                cursor.each(function(err,doc){
                    if(err){
                        errorCB(500,'Error!')
                    }
                    else if(doc!=null){
                        result.push(doc);
                    }
                    else{
                        successCB(result);
                    }
                });
            }

        } );

    };
   //  find data in the collection 'songs' by the name
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
  // find all data in the collection 'mixed'
  this.findAllMixedSongs = function(db,  callback) {
    var cursor = db.collection('mixed').find( );
    var i =0;
    var ms =[];
    cursor.each(function(err, doc) {
      //assert.equal(err, null);
      console.log(i++);
      if (doc !== null) {
        ms.push({name_new:doc.name_new,name:doc.name});
        console.log("docname"+doc.name);
        //callback(null,doc);
      } else {
        console.log("not found in the DB");
        console.log("ms"+ms);
        callback(null,ms);
      }
    });

  };
  //find a data in the collection 'mixed' by 'name_new'
  this.findMixedSong = function(db, findby, content, callback) {
    var cursor = db.collection('songs').find({ name : content } );
    var i =0;
    var ms =[];
    cursor.each(function(err, doc) {
      //assert.equal(err, null);
      console.log(i++);
      if (doc !== null) {
        ms.push(doc);
        console.log("mixedname"+doc.name);
        //callback(null,doc);
      } else {
        console.log("not found in the DB");
        console.log("mixed ms "+ms[0].path);
        callback(null,ms);
      }
    });
  };

    this.folderName = function(findby, callback) {
        dirCount = findby;
        callback(null,dirCount);
    };

    //Pre-condition : creation des indexes dans la BD
    this.searchSongs_by_keywords = function(db,keywords,callback) {
        var cursor = db.collection('songs').find({ name: { $regex: keywords, $options: "i"  }  } );
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
  // find a data in the collection 'songs' by  findby
  this.update_AddInDocument = function(db, findby, input, callback) {
    console.log('updateDocument');
    db.collection('songs').update(findby,{$pushAll:input},
      function(err, result) {
        //assert.equal(err, null);
        console.log("Add in document in the songs collection.");
        callback(null, result);
      });
  };
  // edit data  in the collection 'songs'
  this.update_ChangeInDocument = function(db, findby, change, callback) {
    console.log('updateDocument');
    db.collection('songs').update(findby,{$set:change},
      function(err, result) {
        //assert.equal(err, null);
        console.log("Change in document in the songs collection.");
        callback(null, result);
      });
  };
  // remove a part of data in the the collection 'songs'
  this.update_RemoveInDocument = function(db, findby, remove, callback) {
    console.log('updateDocument');
    db.collection('songs').update(findby,{$unset:remove},
      function(err, result) {
        //assert.equal(err, null);
        console.log("remove from a document in the songs collection.");
        callback(null, result);
      });
  };
  // add a songs from client side
  this.uploadSong = function(req,res,callback) {
    var fstream;
    req.pipe(req.busboy);
    var thedire = __dirname + '/../Musics/'+dirCount;
    if (!fs.existsSync(thedire)){
      fs.mkdirSync(thedire);
    }
    req.busboy.on('file', function (fieldname, file, filename) {
      console.log("Uploading: "+ filename);

      //Path where image will be uploaded  '/home/user/Bureau/programClient/Programmable_Web/backend'
      fstream = fs.createWriteStream(thedire+'/'+ filename);
      file.pipe(fstream);
      fstream.on('close', function () {
        console.log("Upload Finished of " + filename);
        //res.redirect('back');           //where to go next
        callback(null, { success: true });
      });
    });

  };

  // add song file in the database
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
  // search names of folders in the folder 'Music'
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
  // get names of songs in the folder
  function getFiles(dirName, callback) {
    fs.readdir(dirName, function(error, directoryObject) {
      callback(directoryObject);
    });
  };
  // create a new folder with the filename in 'Music' and stock song file in it from the client side
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
    // get data in the collection 'songs' by '_id'
    this.getSongsById = function(db, idSong, callback){
        db.collection('songs').findOne({"_id" : ObjectID(idSong) },function(err,result){
          /*if(err){
            callback(err, null);
          }*/
          callback(null, result);
        });
    };
    // get 'feedbacks' in the collection 'songs' search by '_id'
    this.getFeedbacks = function(db,idSong,successCB,errorCB){
        db.collection('songs').findOne({"_id" : idSong },function(err,result){
            if(result==null){
                errorCB(404,"This song doesn\'t exist");
            }else successCB(result.feedbacks);
        });
    };

    this.getAverageMark =  function(db,songId, callback) {

      var res = db.collection('songs').aggregate(
        [
         {
           $project: {
             markAvg: { $avg: "$feedbacks.mark"},
           }
          }
        ]
      ).toArray(function(err, result) {
        var element = result.map(function(x) { return x._id.toString(); }).indexOf(songId);
        callback(null, result[element]);
      });
    };
    // update a data in the collection 'songs'
    this.updateMark = function(db,songId, userId, mark, callback){
        /*if(newFeedback.user==undefined || newFeedback.newMark==undefined ||newFeedback.comment==undefined){
            callback(404,null);
        }
        else if(newFeedback.newMark==null||newFeedback.user==null||newFeedback.comment==null){
            errorCB(400,"The message format is wrong");
        }
        else{*/
        db.collection('songs').updateOne(
                {"_id" : ObjectID(songId), "feedbacks._id": ObjectID(userId) },
                {
                    $set: { "feedbacks.$.mark" : +mark }
                }
            );

        callback(null,"Mark added!");

    };
    // add a 'mark' in the column 'feedbacks'
    this.postMark = function(db, songId, userId, mark, callback){
      db.collection('songs').updateOne(
        {"_id" : ObjectID(songId) },
          {
              $push: {"feedbacks": {_id: ObjectID(userId), mark: +mark, comment: null}}
          }
      );

      callback(null,"Mark added!");
    };
    // edit a 'comment' in the column 'feedbacks'
    this.updateComment = function(db,songId, userId, comment, callback){
      db.collection('songs').updateOne(
        {"_id" : ObjectID(songId), "feedbacks._id": ObjectID(userId) },
        {
          $set: { "feedbacks.$.comment" : comment }
        }
      );

      callback(null,"Comment added!");
    };
  // add a 'comment' in the column 'feedbacks'
    this.postComment = function(db, songId, userId, comment, callback){
      db.collection('songs').updateOne(
        {"_id" : ObjectID(songId) },
        {
          $push: { "feedbacks": { _id: ObjectID(userId), comment: comment, mark: null } }
        }
      );

      callback(null,"Comment added!");
    };

    // add a data of mixed information in the collection of 'songs'
    this.savemixedjson = function(db, input, callback) {
      db.collection('songs').insertOne(
          {name: input.name_new,
          info: input.info,
          path: input.name, //A modifier d'urgence
          feedbacks: [],
           author: input.author,
           created_at: input.created_at,
           isPublic: true,
              sumMarks: 0
          },
        function(err, result) {
          console.log("Inserted a document into the songs collection.");
          callback(null, result);
        });
    };
};

exports.SongsRepository = SongsRepository;
