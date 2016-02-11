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


  /*  describe("Unit test for function findUserByPseudo", function() {
        it("should find a user", function(done) {

            db.collection('users').insertOne( { 'email': 'test@gmail.com' },   function(err, result) {
                expect(result.email).to.be.equal("test@gmail.com");
            });

            done();

            usersRepository.findUserByPseudo(db, "test@gmail.com", function(err, result) {
                expect(result).to.exist;
                expect(result.email).to.be.equal("test@gmail.com");
            });
=======
>>>>>>> c3dd11fae940e50492800322ae4ddc11b16ad1a4


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
<<<<<<< HEAD
        });

    });*/


    /*describe("Unit test for function addUser", function() {

        it("should not add an incompleted user without email", function() {
            usersRepository.addUser(db, {password : "random", name : "Echyzen", first_name : "Ryoama"}, function(err, result) {
                expect(result).to.exist;
                expect(result).to.be.empty;
                expect(err).to.be.equal('Value is not true!');
            });
        });

        it("should not add an incompleted user without password", function() {
            usersRepository.addUser(db, {email : "tesdt@gmail.com", name : "Echyzen", first_name : "Ryoama"}, function(err, result) {
                expect(result).to.exist;
                expect(result).to.be.empty;
                expect(err).to.be.equal('Value is not true!');
            });
        });

        it("should not add an incompleted user without first_name", function() {
            usersRepository.addUser(db, {email : "tesdt@gmail.com", name : "Echyzen", password : "random"}, function(err, result) {
                expect(result).to.exist;
                expect(result).to.be.empty;
                expect(err).to.be.equal('Value is not true!');
            });
        });
=======
    });


<<<<<<< HEAD
>>>>>>> c3dd11fae940e50492800322ae4ddc11b16ad1a4
=======
    it("add a mix", function(done) {
>>>>>>> e455a154867d35daa94b6cdb27ca5b954bcbd189

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
<<<<<<< HEAD
*/
});
