'use strict';

//var should = require("should");
var expect = require("expect.js");
var assert = require("assert");
var request = require("supertest");
var constants = require('../config/constants');

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();


var mongoose = require('mongoose');
var db;
var dbs;
var userID;

// On set notre adresse serveur
var server = request.agent("http://localhost:3000");

describe("Unit test for feedbacks routes", function() {

    before(function (done) {

        mongoose.connect(constants.MONGO_URL_TEST_DB);
        db = mongoose.connection;
        dbs = mongoose.connection.db;

        dbs.dropDatabase();
        dbs.createCollection('users');

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
                    mongoose.connection.close();
                    done();
                });
        });
    });


    after(function (done) {
        dbs.dropDatabase();
        dbs.createCollection('users');

        done();
    });



    it("add a mix", function(done) {

        var myMix =
        {
            name_new: "Test new name 1",
            info: "Its just a test",
            name: "Test name 1",
            author: {_id : userID, full_name : "Echyzen"},
            created_at: "Today"
        };

        server.post("/savemixed")
            .send({mixed : myMix})
            .expect(200)
            .end( function(err, res) {
                expect(res.status).to.be.equal(200);
                expect(res.body.status).to.be.equal(constants.JSON_STATUS_SUCCESS);
                expect(res.body.title).to.be.equal('Sauvegarde');
                expect(res.body.message).to.be.equal('Votre mix a été sauvegardé');
                done();
            });
    });


    it("add a mix", function(done) {

        var myMix =
        {
            name_new: "Test new name 1",
            info: "Its just a test",
            name: "Test name 1",
            author: {_id : userID, full_name : "Echyzen"},
            created_at: "Today"
        };

        server.post("/savemixed")
            .send({mixed : myMix})
            .expect(200)
            .end( function(err, res) {
                expect(res.status).to.be.equal(200);
                expect(res.body.status).to.be.equal(constants.JSON_STATUS_SUCCESS);
                expect(res.body.title).to.be.equal('Sauvegarde');
                expect(res.body.message).to.be.equal('Votre mix a été sauvegardé');
                done();
            });
    });

    /**
     server.post("/mix/")
     .send({params : 1})
     .expect(401)
     .end( function(err, res) {
                console.log("Entré");
                console.log(res);
                console.log("Fin");
                done();
            });
     **/
});
