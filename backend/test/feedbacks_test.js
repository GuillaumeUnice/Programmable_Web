'use strict';

//var should = require("should");
var expect = require("expect.js");
var assert = require("assert");
var request = require("supertest");
var constants = require('../config/constants');

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
    });



    it("should not login with a wrong password but a correct user", function(done) {

    });

    it("should login user", function(done) {

    });

});
