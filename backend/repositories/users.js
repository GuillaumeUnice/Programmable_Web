function UsersRepository () {

  this.findUserByPseudo = function(db, userEmail, callback) {
    db.collection('users').findOne( { 'email': userEmail },   function(err, result) {
        //console.log(result);
        callback(null, result);
      });
  };

  this.addUser = function(db, user, callback) {
    db.collection('users').insertOne(user,
      function(err, result) {
          callback(null, result);
      });
  }; 
};

exports.UsersRepository = UsersRepository;