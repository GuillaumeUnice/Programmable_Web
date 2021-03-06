var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var ObjectId = require("bson-objectid");

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
                    usersRepository.addFollower(req.db,idfollowing,user,function(){
                        usersRepository.addFollowing(req.db,idUser,following,function(){
                            var event = {
                                type: "social",
                                name: "You",
                                action: " are now following "+following.full_name,
                                created_at: new Date().getTime()};
                            usersRepository.writeEvent(req.db,idUser,event,function(){
                                event.name = user.full_name;
                                event.action = " is now following "+following.full_name;
                                usersRepository.notifyFollowers(req.db,idUser,event,
                                    function(msg){
                                        usersRepository.findUserById(req.db,idUser,function(user){
                                            res.send({following: user.following, events : user.events});
                                        })
                                    },function(code,msg){
                                        res.send(code,msg)
                                    }
                                )
                            },function(code,msg){
                                res.send(code,msg);
                            });
                        });
                        });

                    });

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
    usersRepository.removeFollowing(req.db,ObjectId(req.body.idUser),ObjectId(req.body.idFollowing),function(){
        usersRepository.removeFollower(req.db,ObjectId(req.body.idFollowing),ObjectId(req.body.idUser),function(){
            usersRepository.findUserById(req.db,ObjectId(req.body.idUser),function(result){
                res.send(result.following);
            });
        });
    });
};