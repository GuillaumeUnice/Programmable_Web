function UsersRepository () {

  this.findUserByPseudo = function(db, userEmail, callback) {
    db.collection('users').findOne( { 'email': userEmail },   function(err, result) {
        callback(null, result);
      });
  };

  this.findUserById = function(db, idUser, successCB, errorCB) {
    db.collection('users').findOne( { '_id': idUser },   function(err, result) {
      if(err){
        errorCB(500,"Error!")
      }
      else if(result==null){
        errorCB(404,'This user doesn\'t exist');
      }
      else{
        successCB(result);
      }
    });
  };

  this.searchUserByKeywords = function(db, keywords, callback) {
    var cursor = db.collection('users').find( { $text: { $search: keywords } } );
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

  this.addUser = function(db, user, callback) {
    
    if((user.password === undefined) || (user.email === undefined) || (user.full_name === undefined)) {
      callback('Value is not true!', null);
    }

    db.collection('users').insertOne({full_name : user.full_name,
          email: user.email,
          password: user.password,
          following: [],
          followers: [],
          events: []},
      function(err, result) {
          callback(null, result);
      });
  };

  this.writeEvent = function(db,idUser,event){
    db.collection('users').updateOne({"_id" : idUser },{ $push: { "events": event } });
  };


  this.notifyFollowers = function(db,idUser,event,successCB,errorCB){
    db.collection('users').findOne({"_id" : idUser },function(err,doc){
      if(err){
        errorCB(500,"Error!");
      }else {
        var results = doc.followers;

        for(var i = 0; i<results.length;i++){
          db.collection('users').updateOne({"_id" : results[i]._id},{ $push: { "events": event } });
        }
        successCB("The followers are notified");
      }
    });
  }
}

exports.UsersRepository = UsersRepository;