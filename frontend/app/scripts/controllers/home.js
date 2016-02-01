'use strict';

angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, searchService,currentMusicService) {
    $scope.searchInfo = {motsCles: null};
    $scope.results = [];
    $scope.chosenMusic = null;

    $scope.sendKeyWords = function() {
      searchService.search($scope.searchInfo).then(function(data){
        $scope.results = data;
      },function(msg){
        console.log('erreur promesses : ' + msg);
      });
    };

    $scope.startListening = function(result){
      $scope.chosenMusic = result;
    };

    $scope.$watch('chosenMusic', function (newValue, oldValue) {
      if (newValue !== oldValue){
        currentMusicService.setTitle(newValue.name);
        currentMusicService.setFeedbacks([newValue.feedbacks]);
      }
    });

  });
