'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'rzModule',
    'notifications',
    'angularFileUpload'
  ])
  .constant('CONFIG', {
    baseUrl: 'http://localhost:3000',
    baseUrlApi: 'http://localhost:3000',

    JSON_STATUS_SUCCESS: 1,
    JSON_STATUS_WARNING: -1,
    JSON_STATUS_NOTICE: 0,
    JSON_STATUS_ERROR: -2,

  })
  .config(function ($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        access: { requiredLogin: false }
      })
      .when('/', {
        templateUrl: 'views/mix.html',
        controller: 'MixCtrl',
        controllerAs: 'mix',
        access: { requiredLogin: false }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'UserCtrl',
        access: { requiredLogin: false }
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'UserCtrl',
        access: { requiredLogin: true }
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope, $location, auth) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if (nextRoute.access.requiredLogin && !auth.isLogged) {
            $location.path("/login");
        }
    });
  });
