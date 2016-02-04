var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

exports.followSomeone = function(req,res){
    var idUser = req.body.idUser;
    var idFollowed = req.body.idFollowed;
    //We have to test first if the user isn't already following the other user
    //...
    req.db.collection('users').updateOne({_id : idUser},{ $push: { followed: idFollowed } });
    req.db.collection('users').updateOne({_id : idFollowed},{ $push: { followers: idUser } });
    res.send("Success!")
};

exports.getFollowed = function(req,res){
    var cursor = db.collection('users').findOne({"_id" : req.body.idUser });
    var first = true;
    cursor.each(function(err, doc) {
        if (doc != null) {
            res.send(doc.followed);
            first = false;
        }
        else if(first) res.send(404,'This user doesn\'t exist');
    });
};

exports.getFollowers = function(req,res){
    var cursor = db.collection('users').findOne({"_id" : req.body.idUser });
    var first = true;
    cursor.each(function(err, doc) {
        if (doc != null) {
            res.send(doc.followers);
            first = false;
        }
        else if(first) res.send(404,'This user doesn\'t exist');
    });
};