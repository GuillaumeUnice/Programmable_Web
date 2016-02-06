'use strict';

var expect = require("expect.js");
var assert = require("assert");
var request = require("supertest");
var constants = require('../config/constants');

var usersRepositoryModule = require('../repositories/users');
var usersRepository = new usersRepositoryModule.UsersRepository();

var mongoose = require('mongoose');
//mongoose.connect(constants.MONGO_URL_TEST_DB);
var db;// = mongoose.connection;
var dbs;// = mongoose.connection.db;
var val;

describe("Unit test for UserRepository", function() {

	before(function (done) {

		mongoose.connect(constants.MONGO_URL_TEST_DB);
		db = mongoose.connection;
		dbs = mongoose.connection.db;

		dbs.dropDatabase();
		dbs.createCollection('users');
	    done();
    });

	after(function (done) {
		dbs.dropDatabase();
		dbs.createCollection('users');
		
		 /*//dbs.close(done);
		 //dbs.close();
		 		dbs.dropDatabase();
		dbs.createCollection('users');*/
		//mongoose.connection.close();
        done();
    });

    describe("Unit test for function findUserByPseudo", function() {
		it("should find a user", function(done) {

			db.collection('users').insertOne( { 'email': 'test@gmail.com' },   function(err, result) {
		        expect(result.email).to.be.equal("test@gmail.com");  
		    });

			done();

			usersRepository.findUserByPseudo(db, "test@gmail.com", function(err, result) {
				expect(result).to.exist;
				expect(result.email).to.be.equal("test@gmail.com");
			});

		});


		it("should not find a user", function() {
			usersRepository.findUserByPseudo(db, "tesdt@gmail.com", function(err, result) {
				expect(result).to.exist;
				expect(result).to.be.empty;
			});
		});

	});


    describe("Unit test for function addUser", function() {

		it("should not add an incompleted user without email", function() {
			usersRepository.addUser(db, {password : "random"}, function(err, result) {
				expect(result).to.exist;
				expect(result).to.be.empty;
				expect(err).to.be.equal('Value is not true!');
			});
		});

		it("should not add an incompleted user without password", function() {
			usersRepository.addUser(db, {email : "tesdt@gmail.com"}, function(err, result) {
				expect(result).to.exist;
				expect(result).to.be.empty;
				expect(err).to.be.equal('Value is not true!');
			});
		});

		it("should add an user", function() {
			usersRepository.addUser(db, {email : "test@gmail.com", password : "random"}, function(err, result) {
				expect(result).to.exist;
				expect(result.email).to.be.equal("test@gmail.com");
				expect(result.password).to.be.equal("random");
			});
		});

	});

});
