'use strict';


/**
 * @ngdoc function
 * @name frontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')

  .controller('MixCtrl', function ($scope,$rootScope, user,mix, CONFIG,FileUploader,ModalService,$routeParams,$q,$http) {

    //** Scope
    /**=========================**/
    $scope.buf = []; $scope.listSongs = []; $scope.listTracks = []; $scope.data = [];
    $scope.isPlaying = false; $scope.canPlay = false; $scope.canStop = true; $scope.showPlayButton = true;
    $scope.song = null;
    $scope.selectedSong = null;
    $scope.mixTable = false;
    $scope.displayLoading = false;
    $scope.loadSong = true;
    $scope.filters = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"];
    $rootScope.allSongs = [
      {
        "titre" : "amy_rehab",
        "artiste" : "Amy Winehouse",
        "annee" : 2006,
        "album" : "Back to Black",
        "genre" : "Soul"
      },{
        "titre" : "bob_love",
        "artiste" : "Bob Marley",
        "annee" : 1971,
        "album" : "Rastaman Vibration",
        "genre" : "Reggae"
      },
      {
        "titre" : "deep_smoke",
        "artiste" : "Deep Purple",
        "annee" : 1972,
        "album" : "Machine Head",
        "genre" : "Hard rock"
      },{
        "titre" : "jamesbrown_get",
        "artiste" : "James Brown",
        "annee" : 1970,
        "album" : "Sex Machine",
        "genre" : "Soul"
      },{
        "titre" : "queen_champions",
        "artiste" : "Queen",
        "annee" : 1977,
        "album" : "News of the World",
        "genre" : "Pop rock"
      }
    ];

    $( "#progressbar" ).progressbar({
      value: 0
    });

    //** Modal
    /** =============== **/
    $scope.showComplex = function() {
      ModalService.showModal({
        templateUrl: "../views/selectSong.html",
        controller: "MixtCtrl",
        inputs: {
          title: "Selectionnez une musique"
        }
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          findSongByName(result.name);
          $scope.loadSong = false;
          $scope.displayLoading = true;
          $scope.getAllTracks(result.name);
          $scope.song = result.name;
        });
      });
    };


    function findSongByName (name) {
      var myL = $rootScope.allSongs.length;
      for(var i = 0; i < myL; i++){
        if($rootScope.allSongs[i].titre == name){
          $scope.selectedSong = $rootScope.allSongs[i];
          break;
        }
      }
    }

    $scope.getMixedSongInfo = function(str){
      var deferred = $q.defer();
      $http.get(CONFIG.baseUrlApi + '/getMixedSongInfo', {params: {name_find: str}})
        .success(function (data) {
          //notification.writeNotification(data);
          deferred.resolve(data);
          //config = data.message;
          console.log(data.message);
        }).error(function (data) {
          //notification.writeNotification(data);
          deferred.reject(false);
        });
      return deferred.promise;
    };

    $scope.init = function () {
      console.log("id "+$routeParams.id );
      mix.init(function(b){
        $rootScope.listSongs =b;
      });
      if($routeParams.id){
        $scope.loadSong = false;
        $scope.displayLoading = true;

        $scope.song = $routeParams.id;
        $scope.getMixedSongInfo($routeParams.id)
          .then(function(data){
            $scope.getAllTracks2(data.message[0].path, data.message);
            //console.log("data"+data.message[0].name);
          },function(msg){
            console.log('erreur promesses : ' + msg);
          });
      } else{
        console.log("new mix");
      }

    };

    $scope.getAllTracks = function(name) {
      mix.getAllTrackList(name, function(b){
        for(var i = 0; i < b.length; i++ ) {
          $scope.data[i] = {
            "gain" : 0.5,
            "gainL" : 0,
            "frequence" : 5000,
            "gainR" : 0,
            "compressor" : false
          };
        }
        $scope.listTracks =b;
      }, function(a){
        $scope.buf = a;
        $scope.displayLoading = false;
        $scope.mixTable = true;
        $scope.$apply();
        console.log("Finis de charger");
      });
    };
    $scope.getAllTracks2 = function(name,conf) {
      //$scope.spinner = {active : true};
      //console.log("conf  "+conf[0]);
      mix.getAllTrackList(name, function(b){
        console.log("kkkkk"+ b.instruments.length);
        for(var i = 0; i < b.instruments.length; i++ ) {
          console.log("kkkkk");
          $scope.data[i] = {
            "gain" : 0.5,
            "gainL" : conf[0].info[i].left,
            "frequence" : conf[0].info[i].frequancy,
            "gainR" : conf[0].info[i].right,
            "compressor" : false
          };
          console.log("scopedata"+ $scope.data[i].frequence);
        }
        $scope.listTracks =b;
        findSongByName(name);
        return conf[0];
      }, function(a){
        //$scope.spinner = {active : false};
        $scope.buf = a;
        $scope.displayLoading = false;
        $scope.mixTable = true;
        $scope.$apply();
        console.log("Finis de charger");
        return conf[0];
      });
    };

    $scope.play = function(n) {
      $scope.showPlayButton = false;
      if($scope.isPlaying){
        mix.pauseReplayAllTracks($scope.buf);
      }else{
        $scope.isPlaying = true;
        mix.playAT($scope.buf,n);
      }
    };

    $scope.pause = function () {
      $scope.showPlayButton = true;
      mix.pauseAT($scope.buf);
    };

    $scope.stop = function () {
      mix.stopAT($scope.buf);
    };

    $scope.savemixed = function (s) {
      mix.savemixed(s);
    };

    $scope.changerangeslide = function (num) {
      console.log('changerangeslide');
      mix.changeRS(num);
    };

    /*****************/

    $scope.setMasterGain = function (val) {
      mix.setMasterGain(val);
      setAllGain(val);
    };

    $scope.setMasterStereo = function (val) {
      mix.setMasterStereo(val);
      setAllStereo(val);
    };

    $scope.setGain = function (i, val) {
      mix.setGain(i, val);
    };

    $scope.setMonoR = function (i, val) {
      mix.setMonoR(i, val);
    };

    $scope.setMonoL = function (i, val) {
      mix.setMonoL(i, val);
    };

    $scope.setFrequence = function (i,val) {
      mix.setFilterFrequency(i,val);
    };

    $scope.setCompressor = function (i) {
      var a = !$scope.data[i].compressor;
      $scope.data[i].compressor = !a;
      //mix.setCompressor(i);
    };



    $scope.setDetune = function (i,val) {
      mix.setFilterDetune(i,val);
    };

    $scope.setQuality = function (i,val) {
      mix.setFilterQuality(i,val);
    };

    $scope.setType = function (val) {
      mix.setFilterType(val);
    };

    function setAllGain(val) {
      var myL = $scope.data.length;
      for(var i = 0; i < myL; i++ ){
        $scope.data[i].gain = val;
      }
    }

    function setAllStereo(val) {
      var myL = $scope.data.length;
      for(var i = 0; i < myL; i++ ){
        $scope.data[i].stereo = val;
      }
    }

    /*************************/


    $scope.mute = function(i, val){
      var a = $scope.data[i].mute;
      $scope.data[i].mute = !a;
    };


    /*** PAS COMPRIS **/


    $scope.muteUnmuteTrack = function () {
      console.log('muteUnmuteTrack');
      mix.muteUnmuteTrack();
    };

    $scope.pppp = function(){
      mix.combine($scope.buf);
    };

  })
  .controller('MixtCtrl', function ($scope,$rootScope, $element, title, close, $q, mix,$location) {
    $scope.title = title;
    $scope.songs = $rootScope.allSongs;
    $scope.canValid = false;

    $scope.name = null;
    $scope.predicate = 'titre';

    $scope.setSelected = function (idSelectedVote) {
      $scope.name = idSelectedVote;
      $scope.canValid = true;
    };

    $scope.charger = function() {
      close({
        name: $scope.name
      }, 500);
    };
  })

  .controller('UploadCtrl', function ($scope,$rootScope, mix,user,CONFIG,$q,$http,FileUploader,$location) {
    $scope.data = {
      "titre" : "",
      "artiste" : "",
      "annee" : 0,
      "album" : "",
      "genre" : ""
    };
    $scope.img = '';
    $scope.genres = ["Rock", "Pop", "Classique", "Jazz", "Soul", "Rap", "Country", "Reggae"];

    $scope.changeGenre = function (i){
      $scope.data.genre = i;
      console.log( $scope.data.genre);
    };

    /** UPLOAD IMAGE **/
    $scope.uploader = new FileUploader({
      url: CONFIG.baseUrlApi + '/upload'
    });

    // Set file uploader music filter
    $scope.uploader.filters.push({
      name: 'soundFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|mp3|'.indexOf(type) !== -1;
      }
    });

    $scope.uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
    };

    // Upload music
    $scope.upload = function () {
      $scope.uploader.upload();
    };

    // Cancel the upload process
    $scope.cancel = function () {
      $scope.uploader.cancel();
    };

    // Remove the upload process
    $scope.remove = function () {
      $scope.uploader.remove();
    };


    $scope.sendFolder = function(name){
      var deferred = $q.defer();
      $http.get(CONFIG.baseUrlApi + '/folderName', {params: {f: name}})
        .success(function (data) {
          console.log("Je suis en succes");
          //notification.writeNotification(data);
          deferred.resolve(data);
          //config = data.message;
        }).error(function (data) {
          //notification.writeNotification(data);
          deferred.reject(false);
        });
      return deferred.promise;
    };

    $scope.valid = function () {
      $scope.sendFolder($scope.data.titre).then(function(data){
        $scope.uploader.uploadAll();
        $rootScope.allSongs.push($scope.data);
      }, function(msg) {
          //
      });
    };


    /**
    uploaderBis.onAfterAddingFile = function(item) {
      var fileExtension = '.' + item.file.name.split('.').pop();
      item.file.name = data.titre + fileExtension;
    };**/

  });
