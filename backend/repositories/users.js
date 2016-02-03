function UsersRepository () {

  this.findUserByPseudo = function(db, userEmail, callback) {
    db.collection('users').findOne( { 'email': userEmail },   function(err, result) {
        callback(null, result);
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
    
    if((user.password === undefined) || (user.email === undefined)) {
      callback('Value is not true!', null);
    }

    db.collection('users').insertOne(user,
      function(err, result) {
          callback(null, result);
      });
  };

};

exports.UsersRepository = UsersRepository;