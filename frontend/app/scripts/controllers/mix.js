'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MixCtrl', function ($scope, CONFIG) {


    $scope.priceSliders = [
      {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }];


    $scope.default = function() {
      var l = $scope.priceSliders.length;
      for( var i = 0 ; i < l ; i ++ ) {
        $scope.priceSliders[i].value = CONFIG.MIX_DEFAULT_SOUND;
      }
    }

  });
