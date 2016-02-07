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

     register: function (user) {
       delete user.confirmPassword;
       var deferred = $q.defer();
       $http.post(CONFIG.baseUrlApi + '/register', user)
         .success(function (data) {
           notification.writeNotification(data);
           deferred.resolve(data);
         }).error(function (data) {
           notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;
     },

     logIn: function (user) {
       var deferred = $q.defer();
       $http.post(CONFIG.baseUrlApi + '/login', user)
         .success(function (data) {
           notification.writeNotification(data);
           deferred.resolve(data);
         }).error(function (data) {
           notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;

     },

     test: function () {
       var deferred = $q.defer();
       $http.post(CONFIG.baseUrlApi + '/test', {user: 'lol'})
         .success(function (data) {
           console.log(data);
           notification.writeNotification(data);
           deferred.resolve(data);
         }).error(function (data) {
           notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;
     },
     logout: function () {
       var deferred = $q.defer();
       $http.post(CONFIG.baseUrlApi + '/logout')
         .success(function (data) {
           console.log(data);
           notification.writeNotification(data);
           deferred.resolve(data);
         }).error(function (data) {
           notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;
     },
     getInfo: function (str) {
       var deferred = $q.defer();
       $http.get(CONFIG.baseUrlApi + '/get', {params: {name_find: str}})
         .success(function (data) {
           notification.writeNotification(data);
           deferred.resolve(data);
           console.log(data.message);
         }).error(function (data) {
           notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;
     },
     myMix: function (userId) {
       var deferred = $q.defer();
       $http.get(CONFIG.baseUrlApi + '/manageMySongs/' + userId)
         .success(function (data) {
           deferred.resolve(data);
           console.log(data.message);
         }).error(function (data) {
           notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;
     },
     

   };
});

