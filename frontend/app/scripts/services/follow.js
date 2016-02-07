'use strict';

/**
 * @ngdoc service
 * @name frontendApp.followService
 * @description
 * # followService
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('follow', function (CONFIG, $http, $q, notification) {
     return {

     getFollowing: function (userId) {
       var deferred = $q.defer();
       $http.get(CONFIG.baseUrlApi + '/follow/following/' + userId)
         .success(function (data) {
           deferred.resolve(data);
         }).error(function (data) {
           deferred.reject(false);
         });
       return deferred.promise;
     },
     getFollowers: function (userId) {
       var deferred = $q.defer();
       $http.get(CONFIG.baseUrlApi + '/follow/followers/' + userId)
         .success(function (data) {
           deferred.resolve(data);
         }).error(function (data) {
           deferred.reject(false);
         });
       return deferred.promise;
     },
     follow: function (myUserId,userId) {
       var deferred = $q.defer();
       $http.post(CONFIG.baseUrlApi + '/follow', {idUser: myUserId, idFollowing:  userId})
         .success(function (data) {
           //notification.writeNotification(data);
           deferred.resolve(data);
         }).error(function (data) {
           //notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;
     },
     unfollow: function (myUserId, userId) {
       var deferred = $q.defer();
       $http.delete(CONFIG.baseUrlApi + '/follow', {idUser: myUserId, idFollowing: userId})
         .success(function (data) {
           //notification.writeNotification(data);
           deferred.resolve(data);
         }).error(function (data) {
           //notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;
     }

   };

});
