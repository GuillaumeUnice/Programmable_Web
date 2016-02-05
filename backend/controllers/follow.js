var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

exports.followSomeone = function(req,res){
    var idUser = req.body.idUser;
    var idFollowed = req.body.idFollowed;

    var user;
    var followed;
    usersRepository.findUserById(req.db,idUser,function(err,result){
        if(result==null){
            res.send(404,'User not found')
        }
        else{
            user = result;
            for(var i = 0; i<user.followed.length;i++){
                if(user.followed[i]==idFollowed){
                    res.send(404,'User already following the other user');
                    return;
                }
            }

            usersRepository.findUserById(req.db,idFollowed,function(err,result){
                if(result==null){
                    res.send(404,'The followed user not found')
                }
                else{
                    followed = result;
                    req.db.collection('users').updateOne({_id : idUser},{ $push: { followed: idFollowed } });
                    req.db.collection('users').updateOne({_id : idFollowed},{ $push: { followers: idUser } });
                    usersRepository.notifyFollowers(req.db,idUser,user.full_name+" is now following "+followed.full_name,
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