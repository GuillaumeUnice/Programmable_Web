'use strict';

/**
 * @ngdoc service
 * @name frontendApp.tokenInterceptor
 * @description
 * # tokenInterceptor
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('tokenInterceptor', function ($q, $window, $location, auth) {
  return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            
            return config;
        },
 
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
 
        // Set Authentication.isAuthenticated to true if 200 received 
        response: function (response) {
            if (response !== null && response.status === 200 && $window.sessionStorage.token && !auth.isAuthenticated) {
                auth.isAuthenticated = true;
            }
            return response || $q.when(response);
        },
 
        // Revoke client authentication if 401 is received 
        responseError: function(rejection) {
            //console.log("ici" + rejection.status + auth.isAuthenticated);
            if (rejection !== null && rejection.status === 401 /*&& ($window.sessionStorage.token || auth.isAuthenticated)*/) {
                delete $window.sessionStorage.token;
                auth.isAuthenticated = false;

                $location.path("/login");
            }
 
            return $q.reject(rejection);
        }
    };
  });
