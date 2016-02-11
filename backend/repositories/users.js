function UsersRepository () {

  /**
   * find a user with his email
   * @param  {Object}   db        database
   * @param  {String}   userEmail user's email
   * @param  {Function} callback  return err and result who contains all user's document
   */
  this.findUserByPseudo = function(db, userEmail, callback) {
    db.collection('users').findOne( { 'email': userEmail },   function(err, result) {
        callback(null, result);
      });
  };

  /**
   * find a user with his _id document
   * @param  {Object} db        database
   * @param  {String} idUser    user's _id
   * @param  {Function} successCB callback success
   * @param  {Function} errorCB   callback error
   */
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

  /**
   * search a user with keywords contains in the user name or first name.
   * This is an insensitive case search
   * @param  {Object}   db       database
   * @param  {String}   keywords simple String who contains substring match
   * @param  {Function} callback return err and result who contains all users who match with this search
   */
  this.searchUserByKeywords = function(db, keywords, callback) {
    var cursor = db.collection('users').find( { full_name: { $regex: keywords, $options: "i" } } );
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

  /**
   * Add an user in database so create a new document in "users collection"
   * @param {Object}   db       database
   * @param {Object}   user     Object who represente user's data
   * @param {Function} callback Callback return err and result who contains the user data
   */
  this.addUser = function(db, user, callback) {
    
    if((user.password === undefined) || (user.email === undefined) || (user.name === undefined) || (user.first_name === undefined)) {
      callback('Value is not true!', null);
    }
    else{
      db.collection('users').insertOne({
            email: user.email,
            password: user.password,
            first_name: user.first_name,
            name: user.name,
            avatar: "avatars/default.png",
            full_name : user.first_name +" "+ user.name,
            following: [],
            followers: [],
            events: [],
            songs: []},
          function(err, result) {
            callback(null, result);
          });
    }
  };

  /**
   * Add a reference to a song in the user document
   * @param {Object}   db       database
   * @param {Object}   user     Object who represente user's data
   * @param {Function} callback Callback return err and result who contains the user data
   */
  this.addSong = function(db,idUser,song,successCB,errorCB){
    db.collection('users').updateOne({_id: idUser},{$push: {songs:
    {_id: song._id, name: song.name_new, created_at : song.created_at}}},function(err,result){
      if(err){
        errorCB(500,"Error!");
      }
      else successCB(result);
    });
  };

  this.removeFollowing = function(db,idUser,idFollowing,callback){
    db.collection('users').updateOne({"_id" : idUser },{ $pull: { following : {_id: idFollowing} } },callback);
  };

  this.removeFollower = function(db,idUser,idFollower,callback){
    db.collection('users').updateOne({"_id" : idUser },{ $pull: { followers : {_id: idFollower} } },callback);
  };

  this.addFollowing = function(db,idUser,following,callback){
    db.collection('users').updateOne({_id : idUser},{ $push: { following: {_id: following._id,
      full_name: following.full_name} } },callback);
  };

  this.addFollower = function(db,idUser,follower,callback){
    db.collection('users').updateOne({_id : idUser},{ $push: { followers: {_id: follower._id,
      full_name: follower.full_name} } },callback);
  };

  this.writeEvent = function(db,idUser,event,callback){
    db.collection('users').updateOne({"_id" : idUser },{ $push: { "events": event } },callback);
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