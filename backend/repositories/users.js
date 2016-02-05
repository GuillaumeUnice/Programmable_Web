function UsersRepository () {

  this.findUserByPseudo = function(db, userEmail, callback) {
    db.collection('users').findOne( { 'email': userEmail },   function(err, result) {
        callback(null, result);
      });
  };

  this.findUserById = function(db, idUser, callback) {
    db.collection('users').findOne( { '_id': idUser },   function(err, result) {
      callback(null, result);
    });
  };

  this.searchUserByKeywords = function(db, keywords, callback) {
    var cursor = db.collection('users').find( { full_name: { $regex: keywords } } );
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
    
    if((user.password === undefined) || (user.email === undefined)) {
      callback('Value is not true!', null);
    }

    db.collection('users').insertOne(user,
      function(err, result) {
          callback(null, result);
      });
  };

  this.writeEvent = function(db,idUser,event){
    db.collection('users').updateOne({"_id" : idUser },{ $push: { "events": event } });
  };

  this.notifyFollowers = function(db,idUser,event){
    var cursor = db.collection('users').findOne({"_id" : idUser });

    cursor.each(function(err, doc) {
      if (doc != null) {
        var results = doc.followers;
        results.forEach(function(result){
          db.collection('users').updateOne({"_id" : result._id },{ $push: { "events": event } });
        })
      }
    });
  }
}

exports.UsersRepository = UsersRepository;