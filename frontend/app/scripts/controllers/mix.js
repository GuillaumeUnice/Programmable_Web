'use strict';


/**
 * @ngdoc function
 * @name frontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')

  .controller('MixCtrl', function ($scope, $rootScope, user, mix, CONFIG, FileUploader, ModalService, $routeParams, $q, $http) {

    /** Scope **/

    $scope.buf = [];
    $scope.listSongs = [];
    $scope.listTracks = [];
    $scope.data = [];
    $scope.isPlaying = false;
    $scope.canPlay = false;
    $scope.canStop = true;
    $scope.showPlayButton = true;
    $scope.song = null;
    $scope.selectedSong = null;
    $scope.mixTable = false;
    $scope.displayLoading = false;
    $scope.loadSong = true;
    $scope.allSongs = CONFIG.LOAD_SONGS;


    /** Init context **/

    $scope.init = function () {
      mix.init(function (b) {
        $rootScope.listSongs = b;
      });
      if ($routeParams.id) {
        $scope.loadSong = false;
        $scope.displayLoading = true;

        $scope.song = $routeParams.id;
        $scope.getMixedSongInfo($routeParams.id)
          .then(function (data) {
            $scope.getAllTracks2(data.message[0].path, data.message);
          }, function (msg) {
          });
      }
    };


    /** Manage player : play, stop, pause **/

    $scope.play = function (n) {
      $scope.showPlayButton = false;
      if ($scope.isPlaying) {
        mix.pauseReplayAllTracks($scope.buf);
      } else {
        $scope.isPlaying = true;
        mix.playAT($scope.buf, n);
      }
    };

    $scope.pause = function () {
      $scope.showPlayButton = true;
      mix.pauseAT($scope.buf);
    };

    $scope.stop = function () {
      mix.stopAT($scope.buf);
    };


    /** SAVE A MIX **/

    $scope.savemixed = function (s) {
      mix.savemixed(s);
    };


    /** TRACK TIME **/

    $scope.changerangeslide = function (num) {
      mix.changeRS(num);
    };


    /** TRACK EFFECTS
     * - monoLeft
     * - monoRight
     * - frequence
     * - gain
     **/

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

    $scope.setFrequence = function (i, val) {
      mix.setFilterFrequency(i, val);
    };


    /** GET MIX INFO **/

    $scope.getMixedSongInfo = function (str) {
      var deferred = $q.defer();
      $http.get(CONFIG.baseUrlApi + '/getMixedSongInfo', {params: {name_find: str}})
        .success(function (data) {
          deferred.resolve(data);
        }).error(function (data) {
          deferred.reject(false);
        });
      return deferred.promise;
    };

    /** GET ALL TRACKS **/

    $scope.getAllTracks = function (name) {
      mix.getAllTrackList(name, function (b) {
        for (var i = 0; i < b.length; i++) {
          $scope.data[i] = {
            "gain": 0.5,
            "gainL": 0,
            "frequence": 5000,
            "gainR": 0,
            "compressor": false
          };
        }
        $scope.listTracks = b;
      }, function (a) {
        $scope.buf = a;
        $scope.displayLoading = false;
        $scope.mixTable = true;
        $scope.$apply();
      });
    };


    /** GET ALL TRACKS V2 **/

    $scope.getAllTracks2 = function (name, conf) {
      mix.getAllTrackList(name, function (b) {
        for (var i = 0; i < b.instruments.length; i++) {
          $scope.data[i] = {
            "gain": 0.5,
            "gainL": conf[0].info[i].left,
            "frequence": conf[0].info[i].frequancy,
            "gainR": conf[0].info[i].right,
            "compressor": false
          };
        }
        $scope.listTracks = b;
        findSongByName(name);
        return conf[0];
      }, function (a) {
        $scope.buf = a;
        $scope.displayLoading = false;
        $scope.mixTable = true;
        $scope.$apply();
        return conf[0];
      });
    };


    /** Find a song by Name **/

    function findSongByName(name) {
      var myL = $scope.allSongs.length;
      for (var i = 0; i < myL; i++) {
        if ($scope.allSongs[i].titre == name) {
          $scope.selectedSong = $scope.allSongs[i];
          break;
        }
      }
    }

    //** Modal
    /** =============== **/
    $scope.showComplex = function () {
      ModalService.showModal({
        templateUrl: "../views/selectSong.html",
        controller: "listLoadSongCtrl",
        inputs: {title: "Selectionnez une musique"}
      }).then(function (modal) {
        modal.element.modal();
        modal.close.then(function (result) {
          findSongByName(result.name);
          $scope.loadSong = false;
          $scope.displayLoading = true;
          $scope.getAllTracks(result.name);
          $scope.song = result.name;
        });
      });
    };


    /** Progress bar **/
    $("#progressbar").progressbar({
      value: 0
    });

  })


/** Modal of selected song **/

  .controller('listLoadSongCtrl', function ($scope, $rootScope, $element, title, close, $q, mix, $location, CONFIG) {

    /** Scope **/
    $scope.title = title;
    $scope.songs = CONFIG.LOAD_SONGS;
    $scope.canValid = false;
    $scope.name = null;
    $scope.predicate = 'titre';

    /** Selectionnez une musique **/
    $scope.setSelected = function (idSelectedVote) {
      $scope.name = idSelectedVote;
      $scope.canValid = true;
    };

    /** Charger une musique **/
    $scope.charger = function () {
      close({
        name: $scope.name
      }, 500);
    };
  });
