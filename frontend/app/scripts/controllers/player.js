'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('PlayerCtrl', function ($scope, currentMusicService) {
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
  });
