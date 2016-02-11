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

describe("Unit test for manageMySongs routes", function() {

	before(function (done) {

		mongoose.connect(constants.MONGO_URL_TEST_DB);
		db = mongoose.connection;
		dbs = mongoose.connection.db;

		dbs.dropDatabase();
		dbs.createCollection('users');

		db.collection('users').insertOne(
			{ 	"$_id" : '56b4e07045b766bd49eb5d63',
				'email': 'test@gmail.com',
				'password' : "$2a$10$vGVaf40wcE/DqZqp2FkUtepyq.CxsRehgk./Z37LzRQ.YizXdclfO"
			},   function(err, result) {
	    }, function(err, result) {
		    console.log(result);
  		});

  		dbs.createCollection('songs');

		db.collection('songs').insertOne(
			{"$_id" : '56b4e07045b766bd49eb5d62',
			"author":{"full_name":"Echyzen Ryoama", "$_id":"56b4e07045b766bd49eb5d63"}},   function(err, result) {
	    }, function(err, result) {
		    console.log(result);
  		});

		mongoose.connection.close();
	    done();
    });

	after(function (done) {
		dbs.dropDatabase();
		dbs.createCollection('users');

        done();
    });

	
	it("should return all user songs", function(done) {
		server.post("/login")
			.send({email : "test@gmail.com", password : "azerty"})
			.expect(200)
			.end( function(err, res) {
				expect(res.status).to.be.equal(200)
				expect(res.body.status).to.be.equal(constants.JSON_STATUS_SUCCESS);
				done();
				server.get("/mix/56b4e07045b766bd49eb5d62")
					.expect(200)
					.end( function(err, res) {
						expect(res.status).to.be.equal(200)
						//expect(res.body.status).to.be.equal(constants.JSON_STATUS_SUCCESS);
						
					});
				
			});
	});

});
