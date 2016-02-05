var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

exports.followSomeone = function(req,res){
    var idUser = req.body.idUser;
    var idfollowing = req.body.idFollowing;

    var user;
    var following;
    usersRepository.findUserById(req.db,idUser,function(err,result){
        if(result==null){
            res.send(404,'User not found')
        }
        else{
            user = result;
            for(var i = 0; i<user.following.length;i++){
                if(user.following[i]._id==idfollowing){
                    res.send(404,'User already following the other user');
                    return;
                }
            }

            usersRepository.findUserById(req.db,idfollowing,function(err,result){
                if(result==null){
                    res.send(404,'The user to follow not found')
                }
                else{
                    following = result;
                    req.db.collection('users').updateOne({_id : idUser},{ $push: { following: {_id: idfollowing,
                    full_name: following.full_name} } });
                    req.db.collection('users').updateOne({_id : idfollowing},{ $push: { followers: {_id: idUser,
                    full_name: user.full_name} } });
                    var event = {describ: user.full_name+" is now following "+following.full_name,
                        created_at: new Date().getTime()};
                    usersRepository.notifyFollowers(req.db,idUser,event,
                     function(){
                         res.send('Success!')
                     },function(){
                            res.send(500,'Error!')
                        }
                )
                }
            });
        }
    });
};

exports.getFollowing = function(req,res){
    req.db.collection('users').findOne({_id : req.params.idUser },function(err,doc){
        if(doc==null){
            res.send(404,'This user doesn\'t exist');
        }
        else res.send(doc.following);
    });
};

exports.getFollowers = function(req,res){
    req.db.collection('users').findOne({_id : req.params.idUser },function(err,doc){
        if(doc==null){
            res.send(404,'This user doesn\'t exist');
        }
        else res.send(doc.followers);
    });
};