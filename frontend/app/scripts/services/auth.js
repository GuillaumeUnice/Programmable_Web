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
    var observerCallbacks = [];

     var auth = {
        isLogged: false,
        username: null,
        id: null,
        full_name: null,
       registerObserverCallback: function(callback){
         observerCallbacks.push(callback);
       },
       notifyObservers: function() {
         angular.forEach(observerCallbacks, function (callback) {
           callback();
         })
       }
    };

    return auth;
  });
