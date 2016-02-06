'use strict';

/**
 * @ngdoc service
 * @name frontendApp.auth
 * @description
 * # auth
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('auth', function () {
     var auth = {
        isLogged: false,
        username: null
    };

    return auth;
  });
