var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

exports.followSomeone = function(req,res){
    var idUser = req.body.idUser;
    var idFollowed = req.body.idFollowed;
    //We have to test first if the user isn't already following the other user
    //...
    req.db.collection('users').updateOne({_id : idUser},{ $push: { followed: idFollowed } });
    req.db.collection('users').updateOne({_id : idFollowed},{ $push: { followers: idUser } });
    req.db.collection('users').findOne({_id : idFollowed},function(err,doc){
            if(err){
                res.send(404,'Error');
            }
           else{
                usersRepository.writeEvent(req.db,idUser,"Vous suivez "+doc.full_name);
                res.send("Success!")
            }
    });
};

exports.getFollowed = function(req,res){
    var cursor = req.db.collection('users').findOne({_id : req.params.idUser },function(err,doc){
        if(err){
            res.send(404,'This user doesn\'t exist');
        }
        else res.send(doc.followed);
    });
};

exports.getFollowers = function(req,res){
    var cursor = req.db.collection('users').findOne({_id : req.params.idUser },function(err,doc){
        if(err){
            res.send(404,'This user doesn\'t exist');
        }
        else res.send(doc.followed);
    });
};