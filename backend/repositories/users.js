function UsersRepository () {

  this.findUserByPseudo = function(db, userEmail, callback) {
    db.collection('users').findOne( { 'email': userEmail },   function(err, result) {
        callback(null, result);
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