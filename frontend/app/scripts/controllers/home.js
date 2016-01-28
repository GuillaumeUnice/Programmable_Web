'use strict';

angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, $http, CONFIG, $location, $window, searchService,user) {
    $scope.searchInfo = {motsCles: null};
    $scope.results = [];

    $scope.sendKeyWords = function() {
      searchService.search($scope.searchInfo).then(function(data){
        $scope.results = data;
      },function(msg){
        console.log('erreur promesses : ' + msg);
      });
    }

    $scope.startListening = function(result){

    }

  });
