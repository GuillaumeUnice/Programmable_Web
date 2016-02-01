'use strict';

//var should = require("should");
var expect = require("expect.js");
var assert = require("assert");
var request = require("supertest");
var constants = require('../config/constants');

// On set notre adresse serveur
var server = request.agent("http://localhost:3000");

describe("Unit test for auth routes", function() {

	before(function (done) {
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

	after(function (done) {
        done();
    });
});
