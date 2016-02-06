'use strict';

/**
 * @ngdoc filter
 * @name frontendApp.filter:follow
 * @function
 * @description
 * # follow
 * Filter in the frontendApp.
 */
angular.module('frontendApp')
  .filter('follow', function () {
    return function (input, followers) {
    	return (followers.map(function(x) {return x._id; }).indexOf(input) !== -1);
    };
  });
