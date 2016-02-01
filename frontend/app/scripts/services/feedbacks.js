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
  .factory('feedbackService', function (CONFIG, $http, $q) {
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
      }

    };
  });
