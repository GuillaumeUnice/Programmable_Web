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
  .factory('searchService', function (CONFIG, $http, $q) {
    return {

      search: function (searchInfo) {
        var deferred = $q.defer();
        $http.post(CONFIG.baseUrlApi + '/search',searchInfo)
          .success(function (data) {
            console.log(data);
            deferred.resolve(data);
          }).error(function (data) {
            deferred.reject(false);
          });
        return deferred.promise;
      }

    };
  });

