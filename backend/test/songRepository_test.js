/*'use strict';

var expect = require("expect.js");
var assert = require("assert");
var request = require("supertest");
var constants = require('../config/constants');

var songsRepositoryModule = require('../repositories/songs');
var songsRepository = new songsRepositoryModule.SongsRepository();

var mongoose = require('mongoose');
//mongoose.connect(constants.MONGO_URL_TEST_DB);
var db;// = mongoose.connection;
var dbs;// = mongoose.connection.db;
var val;

describe("Unit test for SongsRepository", function() {

  before(function (done) {

    mongoose.connect(constants.MONGO_URL_TEST_DB);
    db = mongoose.connection;
    dbs = mongoose.connection.db;

    dbs.dropDatabase();
    dbs.createCollection('songs');
    done();
  });

  after(function (done) {
    dbs.dropDatabase();
    dbs.createCollection('songs');

    //dbs.close(done);
     //dbs.close();
     dbs.dropDatabase();
     dbs.createCollection('users');
    //mongoose.connection.close();
    done();
  });

  describe("Unit test for function findMixedSong", function() {
    var id;
    it("save information of mixed json", function(done) {
      db.collection('songs').insertOne( {"_id":"56b4ee3845b766bd49eb5d00","path":"images/test.wav","name":"basse","feedbacks":[{"_id":"56b4e07045b766bd49eb5d00","mark":1,"comment":"Ceci est un commentaire"}],"author":{"full_name":"Echyzen","_id":"56b4e07045b766bd49eb5d00"}},   function(err,result) {
        //console.log("feed"+result.feedbacks);
        //expect(result.feedbacks[0]).to.be.equal(1);
      });
      db.collection('songs').insertOne( {"_id":"56b86e74609603727b68dd88","path":"images/Lean_On_Alternative.wav","name":"Lean On Alternative","sum_mark":0,"feedbacks":[{"_id":"56b4e07045b766bd49eb5d88","mark":4,"comment":"I love this song but a little low :D"}],"author":{"full_name":"Echyzen Ryoama","_id":"56b4e07045b766bd49eb5d88"}},   function(err,result) {
        //console.log("feed"+result.feedbacks);
        //expect(result.feedbacks[0]).to.be.equal(1);
      });

      done();
      songsRepository.findMixedSong(db,"name","basse", function(err,result) {
        expect(result).to.exist;
        expect(result[0].path).to.be.equal("images/test.wav");
      });

    });

  });

  describe("Unit test for function updateComment", function() {
    var id;
    it("save information of updateComment", function(done) {
      db.collection('songs').insertOne( {"_id":"56b4ee3845b766bd49eb5d00","path":"images/test.wav","name":"basse","feedbacks":[{"_id":"56b4e07045b766bd49eb5d00","mark":1,"comment":"Ceci est un commentaire"}],"author":{"full_name":"Echyzen","_id":"56b4e07045b766bd49eb5d00"}},   function(err,result) {
        //console.log("feed"+result.feedbacks);
        //expect(result.feedbacks[0]).to.be.equal(1);
      });
      //var bb = db.collection('songs').find();
      done();
      songsRepository.updateComment(db,"56b4ee3845b766bd49eb5d00","56b4e07045b766bd49eb5d00","good", function(err,result) {
        db.collection('songs').find({"_id":"56b4ee3845b766bd49eb5d00"},function(err,result){
          expect(result).to.exist;
          expect(result.comment).to.be.equal("good");
        });
      });

    });

  });

  describe("Unit test for function savemixedjson", function() {
    it("should not add an incompleted song without name_new", function() {
      songsRepository.savemixedjson(db,
        {
        info: [],
        path: "deep_smoke", //A modifier d'urgence
        feedbacks: [],
        author: {_id : "56a09a1aac05c7ed0df16866"},
        created_at: 1455192358810.000000,
        isPublic: true,
        sumMarks: 0
      }, function(err, result) {
        expect(result).to.exist;
        expect(result).to.be.empty;
        expect(err).to.be.equal('Value is not true!');
      });
    });

    it("should not add an incompleted song without info", function() {
      songsRepository.savemixedjson(db, {
        name: "new",
        path: "deep_smoke", //A modifier d'urgence
        feedbacks: [],
        author: {_id : "56a09a1aac05c7ed0df16866"},
        created_at: 1455192358810.000000,
        isPublic: true,
        sumMarks: 0
      }, function(err, result) {
        expect(result).to.exist;
        expect(result).to.be.empty;
        expect(err).to.be.equal('Value is not true!');
      });
    });

    it("should not add an incompleted song without path", function() {
      songsRepository.savemixedjson(db, {
        name: "new",
        info: [],
        feedbacks: [],
        author: {_id : "56a09a1aac05c7ed0df16866"},
        created_at: 1455192358810.000000,
        isPublic: true,
        sumMarks: 0
      }, function(err, result) {
        expect(result).to.exist;
        expect(result).to.be.empty;
        expect(err).to.be.equal('Value is not true!');
      });
    });

    it("should not add an incompleted song without create_at", function() {
      songsRepository.savemixedjson(db, {
        name: "new",
        info: [],
        path: "deep_smoke", //A modifier d'urgence
        feedbacks: [],
        author: {_id : "56a09a1aac05c7ed0df16866"},
        isPublic: true,
        sumMarks: 0
      }, function(err, result) {
        expect(result).to.exist;
        expect(result).to.be.empty;
        expect(err).to.be.equal('Value is not true!');
      });
    });

  });

});*/
