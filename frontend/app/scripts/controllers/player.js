'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PlayerCtrl', function ($scope, $rootScope, currentMusicService, currentMix) {
var activeUrl = null;

    $scope.title = null;
    $scope.$watch(function () { return currentMusicService.getTitle(); }, function (newValue, oldValue) {
      if (newValue !== oldValue) $scope.title = newValue;
    });

    $scope.paused = true;

    $scope.$on('wavesurferInit', function (e, wavesurfer) {
        $scope.wavesurfer = wavesurfer;

        $scope.wavesurfer.on('play', function () {
            $scope.paused = false;
        });

        $scope.wavesurfer.on('pause', function () {
            $scope.paused = true;
        });

        $scope.wavesurfer.on('finish', function () {
            $scope.paused = true;
            $scope.wavesurfer.seekTo(0);
            $scope.$apply();
        });
    });

    $scope.play = function (url) {
        if (!$scope.wavesurfer) {
            return;
        }

        activeUrl = url;

        $scope.wavesurfer.once('ready', function () {
            $scope.wavesurfer.play();
            $scope.$apply();
        });

        $scope.wavesurfer.load(activeUrl);
    };

    $scope.isPlaying = function (url) {
        return url == activeUrl;
    };

    $scope.commentTab = [];
    $scope.$watch(function () { return currentMusicService.getFeedbacks(); }, function (newValue, oldValue) {
      if (newValue !== oldValue) $scope.commentTab = newValue;
    });

    $scope.test = function (mix) {
    console.log("test");
    
    currentMix.getMix(mix).then(function(data){
      console.log(data);
      $scope.currentSong = data;
      var element = data.data.feedbacks.map(function(x) { return x._id.toString(); }).indexOf(auth._id);
      if(element === -1){
        $scope.currentSong.myComment = "";
        $scope.currentSong.myMark = null;
      } else {
        $scope.currentSong.myMark = data.feedbacks[element].mark;
        $scope.currentSong.myComment = data.feedbacks[element].comment;
      }

      //console.log(data.data);
    },function(msg){
      console.log('erreur promesses : ' + msg);
    });
  }

  });
