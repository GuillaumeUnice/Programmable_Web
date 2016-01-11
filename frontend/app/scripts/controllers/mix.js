'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('MixCtrl', function ($scope) {

    $scope.priceSlider1 = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        vertical: true
      }
    };

    $scope.priceSlider2 = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        vertical: true
      }
    };

    $scope.priceSlider3 = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        vertical: true
      }
    };

    $scope.priceSlider4 = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        vertical: true
      }
    };

    $scope.priceSlider5 = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        vertical: true
      }
    };

    $scope.priceSlider6 = {
      value: 50,
      options: {
        floor: 0,
        ceil: 100,
        vertical: true
      }
    };
  });
