/**
 * Created by sy306571 on 25/01/16.
 */
'use strict';

/**
 * @ngdoc service
 * @name frontendApp.user
 * @description
 * # search
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('searchService', function (CONFIG, $http, $q, notification) {
    return {

      search: function (searchInfo) {
        var search = { keywords: searchInfo};
        var deferred = $q.defer();
        $http.post(CONFIG.baseUrlApi + '/search', search)
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

