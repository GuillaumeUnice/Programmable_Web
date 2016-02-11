'use strict';

//var should = require("should");
var expect = require("expect.js");
var assert = require("assert");
var request = require("supertest");
var constants = require('../config/constants');

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();


var mongoose = require('mongoose');
var db;
var dbs;
var userID;

// On set notre adresse serveur
var server = request.agent("http://localhost:3000");

describe("Unit test for search routes", function() {
    before(function (done) {

        mongoose.connect(constants.MONGO_URL_TEST_DB);
        db = mongoose.connection;
        dbs = mongoose.connection.db;

        dbs.dropDatabase();
        dbs.createCollection('users');
        dbs.createCollection('songs');


        usersRepository.addUser(db, {
            email: "test@gmail.com",
            password: "azerty",
            name: "Echyzen",
            first_name: "Ryoama"
        }, function (err, result) {
            server.post("/login")
                .send({email: "test@gmail.com", password: "azerty"})
                .end(function (err, res) {
                    userID = res.body.data._id;
                    songsRepository.savemixedjson(db,
                        {
                            name_new: "Ma chanson remixee",
                            name: "blabla",
                            info: [],
                            feedbacks: [],
                            author: {_id: userID, full_name: "blabla"},
                            created_at: 0
                        },function(err,result){

                        })
                    mongoose.connection.close();
                    done();
                });
        });
    });


    after(function (done) {
        dbs.dropDatabase();
        dbs.createCollection('users');
        dbs.createCollection('songs');
        done();

    });

    it("should return all user songs", function(done) {
        server.post("/search")
            .send({keywords : "chanson"})
            .end( function(err, res) {
                //expect(res.status).to.be.equal(200);
                console.log(res.body);
                console.log(res.message);
                console.log(res.status);

                //expect(res.users).to.be.equal([]);
                // expect(res.body.title).to.be.equal("Add Mix to player");
                // expect(res.body.message).to.be.equal("The mix is now in the player!");

                done();
            });
    });
});



