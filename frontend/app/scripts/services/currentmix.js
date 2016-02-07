'use strict';

/**
 * @ngdoc service
 * @name frontendApp.currentMix
 * @description
 * # currentMix
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('currentMix', function ($q, notification, $http, CONFIG) {
    return {
     getMix: function (mixName) {
      console.log(mixName);
       var deferred = $q.defer();
       $http.get(CONFIG.baseUrlApi + '/mix/' + mixName._id)
         .success(function (data) {
           console.log(data)
           //notification.writeNotification(data);
           deferred.resolve(data);
         }).error(function (data) {
           notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;
     },
      getMixPlay: function (mixName) {
      console.log(mixName);
       var deferred = $q.defer();
       $http.get(CONFIG.baseUrlApi + '/images/test.wav')
         .success(function (data) {
           //console.log(data)
           //notification.writeNotification(data);
           deferred.resolve(data);
         }).error(function (data) {
           notification.writeNotification(data);
           deferred.reject(false);
         });
       return deferred.promise;
     }
   };

  });
