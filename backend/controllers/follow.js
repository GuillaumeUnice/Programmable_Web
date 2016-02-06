var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.followSomeone = function(req,res){
    var idUser = ObjectId(req.body.idUser);
    var idfollowing = ObjectId(req.body.idFollowing);

    var user;
    var following;
    usersRepository.findUserById(req.db,idUser,function(result){
            user = result;
            for(var i = 0; i<user.following.length;i++){
                if(user.following[i]._id.equals(idfollowing)){
                    res.send(400,'User already following the other user');
                    return;
                }
            }

            usersRepository.findUserById(req.db,idfollowing,function(result){
                following = result;
                req.db.collection('users').updateOne({_id : idUser},{ $push: { following: {_id: idfollowing,
                full_name: following.full_name} } });
                req.db.collection('users').updateOne({_id : idfollowing},{ $push: { followers: {_id: idUser,
                    full_name: user.full_name} } });
                var event = {describ: user.full_name+" is now following "+following.full_name,
                        created_at: new Date().getTime()};
                usersRepository.notifyFollowers(req.db,idUser,event,
                     function(msg){
                         res.send(msg)
                     },function(code,msg){
                            res.send(code,msg)
                        }
                )
                },function(code,msg){
                    res.send(code,msg);
                }
            );
        },function(code,msg){
            res.send(code,msg);
        }
    );
};

exports.getFollowing = function(req,res){
    usersRepository.findUserById(req.db,ObjectId(req.params.idUser),function(data){
        res.send(data.following);
    },function(code,msg){
            res.send(code,msg);
    });
};

exports.getFollowers = function(req,res){
    usersRepository.findUserById(req.db,ObjectId(req.params.idUser),function(data){
        res.send(data.followers);
    },function(code,msg){
        res.send(code,msg);
    });
};

exports.unfollow = function(req,res){
    req.db.collection('users').updateOne({"_id" : ObjectId(req.body.idUser) },{ $pull: { following :
    {_id: ObjectId(req.body.idFollowing)} } });
    res.send("Finished!");
};