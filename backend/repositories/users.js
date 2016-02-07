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
            full_name : user.first_name +" "+ user.name,
            following: [],
            followers: [],
            events: [],
            songs: []},
          function(err, result) {
            console.log(result);
            callback(null, result);
          });
    }
  };

  this.addSong = function(db,idUser,song,successCB,errorCB){
    db.collection('users').updateOne({_id: idUser},{$push: {songs:
    {_id: song._id, name: song.name, created_at : song.created_at}}},function(err,result){
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