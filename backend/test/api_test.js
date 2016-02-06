'use strict';

var should = require("should");
var assert = require("assert");
var request = require("supertest");


// On set notre adresse serveur
var server = request.agent("http://localhost:3000/");

describe("Unit test for UNKNOWN routes", function() {

	before(function (done) {
        done();
    });


	it("should return 404 error", function(done) {
		server.get("/random")
			.expect(404)
			.end( function(err, res) {
				res.status.should.equal(404);
				done();
			});
	});

	after(function (done) {
        done();
    });
});
