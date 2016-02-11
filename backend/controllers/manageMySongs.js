var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var express = require('express');
var path = require('path');
var constants = require('../config/constants');
var utils = require('../config/utils');

// module authentification
var jwt = require('jsonwebtoken');
var jwtMid = require('express-jwt');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10); // salage

var ObjectId = require("bson-objectid");

/**
 * get All mix of a specific user
 * @param  {Object} req Contains request data
 * @param  {Object} res Contains respond data
 * @return {Array}     Return Array of songs document register in 'songs collection'
 */
exports.getMySongs = function(req,res){
    songsRepository.findSongs_by_user(req.db,ObjectId(req.params.idUser),function(data){
        res.send(data);
    },function(code,msg){
        res.send(code,msg);
    })
};

exports.getMySongs2 = function(req,res){
    usersRepository.findUserById(req.db,ObjectId(req.params.idUser),function(data){
        res.send(data.songs);
    },function(code,msg){
        res.send(code,msg);
    })
};

exports.save = function(req, res) {
    songsRepository.insertDocument(req.db, {name :req.body.name}, function(err, result) {
        if(err) {
            console.log(err);
            res.status(404);
            res.json({ status: constants.JSON_STATUS_ERROR,
                title: 'Erreur Système',
                message: 'Une erreur inattendue s\'est produite! Veuillez contacter l\'administrateur'});
            return;
        }

        // verify if correct password thank to BCrypt Hash
        // resCompare = true if same password else false
        if(utils.isEmpty(result)) {
            res.status(201);
            res.json({ status: constants.JSON_STATUS_ERROR,
                title: 'Erreur connexion',
                message: 'L\'utilisateur n\'existe pas! Email incorrect!'});
        } else {
            res.status(201);
            res.json({ status: constants.JSON_STATUS_SUCCESS,
                title: 'Connexion',
                message: 'Un compte avec cet email existe déjà!'});
        }
    });
};

exports.upload = function(req, res) {
    //console.log( req.files.file.name);
    songsRepository.uploadSong(req,res, function(err, result) {
        if(err) {
            console.log(err);
            res.status(404);
            res.json({ status: constants.JSON_STATUS_ERROR,
                title: 'Erreur Système',
                message: 'Une erreur inattendue s\'est produite! Veuillez contacter l\'administrateur'});
            return;
        }

        // verify if correct password thank to BCrypt Hash
        // resCompare = true if same password else false
        if(utils.isEmpty(result)) {
            res.status(201);
            res.json({ status: constants.JSON_STATUS_ERROR,
                title: 'Erreur connexion',
                message: 'L\'utilisateur n\'existe pas! Email incorrect!'});
        } else {
            res.status(201);
            res.json({ status: constants.JSON_STATUS_SUCCESS,
                title: 'Connexion',
                message: 'Un compte avec cette email existe déjà!'});
        }
    });
};

exports.download = function(req, res) {

    songsRepository.downloadSong(req.db, req.body.name, function(err, result) {
        if(err) {
            console.log(err);
            res.status(404);
            res.json({ status: constants.JSON_STATUS_ERROR,
                title: 'Erreur Système',
                message: 'Une erreur inattendue s\'est produite! Veuillez contacter l\'administrateur'});
            return;
        }

        // verify if correct password thank to BCrypt Hash
        // resCompare = true if same password else false
        if(utils.isEmpty(result)) {
            res.status(201);
            res.json({ status: constants.JSON_STATUS_ERROR,
                title: 'Erreur connexion',
                message: 'L\'utilisateur n\'existe pas! Email incorrect!'});
        } else {
            res.status(201);
            res.json({ status: constants.JSON_STATUS_SUCCESS,
                title: 'Connexion',
                message: 'Un compte avec cet email existe déjà!'});
        }
    });
};

exports.getTracks = function(req, res) {
    songsRepository.getTracks(function(trackList) {
        if (!trackList)
            return res.send(404, 'No track found');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(trackList));
        res.end();
    });
    //res.sendfile(__dirname + '/../Musics/'  + req.params[0] + '/' + req.params[1]);
};

exports.getTrackById = function(req, res) {
    var id = req.params.id;
    songsRepository.getTrack(id,function(track) {
        if (!track)
            return res.send(404, 'Track not found with id "' + id + '"');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(track));
        res.end();
    });
    //res.sendfile(__dirname + '/../Musics/'  + req.params[0] + '/' + req.params[1]);
};

exports.uploadMixed = function(req, res) {
    //console.log( req.files.file.name);
    songsRepository.uploadMixed(req,res, function(err, result) {
        if(err) {
            console.log(err);
            res.status(404);
            res.json({ status: constants.JSON_STATUS_ERROR,
                title: 'Erreur Système',
                message: 'Une erreur inattendue s\'est produite ! Veuillez contacter l\'administrateur'});
            return;
        }

        // verify if correct password thank to BCrypt Hash
        // resCompare = true if same password else false
        if(utils.isEmpty(result)) {
            res.status(201);
            res.json({ status: constants.JSON_STATUS_ERROR,
                title: 'Erreur connexion',
                message: 'L\'utilisateur n\'existe pas! Email incorrect!'});
        } else {
            res.status(201);
            res.json({ status: constants.JSON_STATUS_SUCCESS,
                title: 'Connexion',
                message: 'Un compte avec cet email existe déjà!'});
        }
    });
};

exports.savemixed = function(req, res) {
    req.body.mixed.created_at = new Date().getTime();
    songsRepository.savemixedjson(req.db, req.body.mixed, function (err, result) {
        if(err) {
            console.log(err);
            res.status(404);
            res.json({ status: constants.JSON_STATUS_ERROR,
                title: 'Erreur Système',
                message: 'Une erreur inattendue s\'est produite! Veuillez contacter l\'administrateur'});
            return;
        }
        else{
            req.body.mixed._id = ObjectId(result.insertedId);
            var idUser = ObjectId(req.body.mixed.author._id);
            usersRepository.addSong(req.db,idUser,req.body.mixed,
                function(msg){

                    usersRepository.findUserById(req.db,idUser,function(data){
                        var event = {
                            type: 'music',
                            name: "You",
                            action: " created a new mix",
                            author: data.full_name,
                            music: req.body.mixed.name_new,
                            created_at: req.body.mixed.created_at
                        };

                        usersRepository.writeEvent(req.db,idUser,event,function(){
                            event.name = data.full_name;
                            usersRepository.notifyFollowers(req.db,idUser,event,function(){
                                res.status(200);
                                res.json({ status: constants.JSON_STATUS_SUCCESS,
                                    title: 'Sauvegarde',
                                    message: 'Votre mix a été sauvegardé'});
                            },function(code,msg){
                                res.status(404);
                                res.json({ status: constants.JSON_STATUS_ERROR,
                                    title: 'Erreur Système',
                                    message: 'Une erreur inattendue s\'est produite ! Veuillez contacter l\'administrateur'});
                            });
                        });
                    },function(code,msg){
                        res.status(404);
                        res.json({ status: constants.JSON_STATUS_ERROR,
                            title: 'Erreur Système',
                            message: 'Une erreur inattendue s\'est produite ! Veuillez contacter l\'administrateur'});
                    });
                },
                function(code,msg){
                    res.status(404);
                    res.json({ status: constants.JSON_STATUS_ERROR,
                        title: 'Erreur Système',
                        message: 'Une erreur inattendue s\'est produite ! Veuillez contacter l\'administrateur'});
                })
        }
    });

};

exports.getMixed = function(req, res) {
    //console.log('find'+req.query.name_find);
    //var mixed = {names:[]};
    songsRepository.findAllMixedSongs(req.db, function(err, result) {
        //console.log(req.session.emailUser);
        //mixed.names.push(result);
        res.json({ status: constants.JSON_STATUS_SUCCESS,
            title: 'Connexion',
            message: result});
    });
};

exports.getMixedSongInfo = function(req, res) {
    //console.log('find'+req.query.name_find);
    //var mixed = {names:[]};
    songsRepository.findMixedSong(req.db,'name' ,req.query.name_find, function(err, result) {
        //console.log(req.session.emailUser);
        //mixed.names.push(result);
        res.json({ status: constants.JSON_STATUS_SUCCESS,
            title: 'Connexion',
            message: result});
    });
};

exports.getFolderName = function(req, res) {
    //console.log('find'+req.query.name_find);
    //var mixed = {names:[]};
    songsRepository.folderName(req.query.f, function(err, result) {
        //console.log(req.session.emailUser);
        //mixed.names.push(result);
        res.json({ status: constants.JSON_STATUS_SUCCESS,
            title: 'Connexion',
            message: result});
    });
};

exports.getSongsByName = function(req, res) {
    console.log('find'+req.query.name_find);
    songsRepository.findSongs_by_field(req.db, 'name' ,req.query.name_find, function(err, result) {
        //console.log(req.session.emailUser);
        res.json({ status: constants.JSON_STATUS_SUCCESS,
            title: 'Connexion',
            message: result});
    });
};

exports.uploadSongs = function(req, res) {
    var id = req.params[0];
    console.log('send songs');
    console.log('kk'+req.params[0] + '/' + req.params[1]);
    console.log(__dirname + '/../Musics/' + req.params[0] + '/' + req.params[1]);
    res.sendfile(path.resolve(__dirname + '/../Musics/' + req.params[0] + '/' + req.params[1]));
};