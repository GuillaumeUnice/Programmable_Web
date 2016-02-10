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
    'angularFileUpload',
    'angularModalService'
  ])
  .constant('CONFIG', {
    baseUrl: 'http://localhost:3000',
    baseUrlApi: 'http://localhost:3000',

    MIX_DEFAULT_SOUND : 50,

    JSON_STATUS_SUCCESS: 1,
    JSON_STATUS_WARNING: -1,
    JSON_STATUS_NOTICE: 0,
    JSON_STATUS_ERROR: -2,
    LOAD_SONGS : [{"titre" : "amy_rehab", "artiste" : "Amy Winehouse", "annee" : 2006, "album" : "Back to Black", "genre" : "Soul"},{"titre" : "bob_love", "artiste" : "Bob Marley", "annee" : 1971, "album" : "Rastaman Vibration", "genre" : "Reggae"}, {"titre" : "deep_smoke", "artiste" : "Deep Purple", "annee" : 1972, "album" : "Machine Head", "genre" : "Hard rock"}, {"titre" : "jamesbrown_get", "artiste" : "James Brown", "annee" : 1970, "album" : "Sex Machine", "genre" : "Soul"},{"titre" : "queen_champions", "artiste" : "Queen", "annee" : 1977, "album" : "News of the World", "genre" : "Pop rock"}]

  })
  .config(function ($routeProvider, $httpProvider) {



        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push('tokenInterceptor');
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home',
        access: { requiredLogin: true }
      })
      .when('/mix', {
        templateUrl: 'views/mix.html',
        controller: 'MixCtrl',
        controllerAs: 'mix',
        access: { requiredLogin: true }
      })
      .when('/upload', {
        templateUrl: 'views/uploadSong.html',
        controller: 'UploadCtrl',
        controllerAs: 'upload',
        access: {requiredLogin: true}
      })
      .when('/mix/:id', {
        templateUrl: 'views/mix.html',
        controller: 'MixCtrl',
        controllerAs: 'mix',
        access: { requiredLogin: true }
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'UserCtrl',
        access: { requiredLogin: false }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'UserCtrl',
        access: { requiredLogin: false }
      })
      .when('/logout', {
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
