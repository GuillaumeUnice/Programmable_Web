'use strict';

//var should = require("should");
var expect = require("expect.js");
var assert = require("assert");
var request = require("supertest");
var constants = require('../config/constants');

var mongoose = require('mongoose');
var db;
var dbs;

// On set notre adresse serveur
var server = request.agent("http://localhost:3000");

describe("Unit test for auth routes", function() {

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
	        expect(result.email).to.be.equal("test@gmail.com");  
	    });
		mongoose.connection.close();
	    done();
    });

	after(function (done) {
		//dbs.dropDatabase();
		//dbs.createCollection('users');

        done();
    });

	it("should not login an non existing user", function(done) {
		server.post("/login")
			.send({email : "random@gmail.com", password : "azerty"})
			.expect(401)
			.end( function(err, res) {
				expect(res.status).to.be.equal(401)
				expect(res.body.status).to.be.equal(constants.JSON_STATUS_ERROR);
				expect(res.body.title).to.be.equal('Erreur connexion');
				expect(res.body.message).to.be.equal('L\'utilisateur n\'existe pas! Email incorrect!');
				done();
			});
	});


	it("should not login with a wrong password but a correct user", function(done) {
		server.post("/login")
			.send({email : "test@gmail.com", password : "lolsefkh"})
			.expect(401)
			.end( function(err, res) {
				expect(res.status).to.be.equal(401)
				expect(res.body.status).to.be.equal(constants.JSON_STATUS_ERROR);
				expect(res.body.title).to.be.equal('Erreur connexion');
				expect(res.body.message).to.be.equal('Le mot de passe est incorrect!');
				done();
			});
	});

	it("should login user", function(done) {
		server.post("/login")
			.send({email : "test@gmail.com", password : "azerty"})
			.expect(200)
			.end( function(err, res) {
				expect(res.status).to.be.equal(200)
				expect(res.body.status).to.be.equal(constants.JSON_STATUS_SUCCESS);
				done();
			});
	});

});
