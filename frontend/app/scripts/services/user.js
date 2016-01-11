'use strict';

/**
 * @ngdoc service
 * @name frontendApp.user
 * @description
 * # user
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('user', function (CONFIG, $http, $q, notification) {
   return {
        logIn: function(username, password) {

        	var deferred = $q.defer();
	        $http.post(CONFIG.baseUrlApi + '/login', { email: username, password: password })
	          .success(function(data) {
	            notification.writeNotification(data);
	            deferred.resolve(data);
	          }).error(function(data) {
	            notification.writeNotification(data);
	            deferred.reject(false);
	          });
	        return deferred.promise;

        },
    
        logOut: function() {
 
        }
    };
  });
