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
       $http.get(CONFIG.baseUrlApi + '/images/basse.mp3')
         .success(function (data) {
           console.log(data)
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
