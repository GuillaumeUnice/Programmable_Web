'use strict';

/**
 * Created by sy306571 on 01/02/16.
 */
/**
 * @ngdoc service
 * @name frontendApp.user
 * @description
 * # feedbacks
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('feedbackService', function (CONFIG, $http, $q, notification) {
    return {

      sendComment: function (idMix,commentInfo) {
        var deferred = $q.defer();
        $http.post(CONFIG.baseUrlApi + '/feedbacks/'+idMix,commentInfo)
          .success(function (data) {
            console.log(data);
            deferred.resolve(data);
          }).error(function (data) {
            deferred.reject(false);
          });
        return deferred.promise;
      },
      addMark: function (idMix,mark) {
        var deferred = $q.defer();
        $http.post(CONFIG.baseUrlApi + '/mark', {songId : idMix, mark: mark})
          .success(function (data) {
            notification.writeNotification(data);
            deferred.resolve(data);
          }).error(function (data) {
            notification.writeNotification(data);
            deferred.reject(false);
          });
        return deferred.promise;
      },
      addComment: function (idMix,comment) {
        var deferred = $q.defer();
        $http.post(CONFIG.baseUrlApi + '/comment', {songId : idMix, comment: comment})
          .success(function (data) {
            notification.writeNotification(data);
            deferred.resolve(data);
          }).error(function (data) {
            notification.writeNotification(data);
            deferred.reject(false);
          });
        return deferred.promise;
      }

    };
  });
