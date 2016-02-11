'use strict';

//var should = require("should");
var expect = require("expect.js");
var assert = require("assert");
var request = require("supertest");
var constants = require('../config/constants');

var feedBackController = require('../controllers/feedbacks');
//var usersRepository = new usersRepositoryModule.UsersRepository();


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

        db.collection('users').insertOne(
            { 'email': 'test@gmail.com',
                'password' : "$2a$10$vGVaf40wcE/DqZqp2FkUtepyq.CxsRehgk./Z37LzRQ.YizXdclfO"
            },   function(err, result) {
            });
        mongoose.connection.close();

        server.post("/login")
            .send({email : "test@gmail.com", password : "azerty"})
            .end( function(err, res) {
                userID = res.body.data._id;
            });
        done();
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


    it("should not login an non existing user", function(done) {

        server.post("/mix/:idMix")
            .send({params : 1})
            .expect(401)
            .end( function(err, res) {
                console.log("Entré");
                console.log(res);
                console.log("Fin");
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


>>>>>>> c3dd11fae940e50492800322ae4ddc11b16ad1a4

    it("should not login with a wrong password but a correct user", function(done) {

    });

    it("should login user", function(done) {

    });
*/
});
