/**
 * Created by salahbennour on 09/02/2016.
 */

'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:UploadCtrl
 * @description
 * # UploadCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')

  .controller('UploadCtrl', function ($scope, $rootScope, mix, user, CONFIG, $q, $http, FileUploader, $location) {

    /** Scope  **/

    $scope.data = {
      "titre": "",
      "artiste": "",
      "annee": 0,
      "album": "",
      "genre": ""
    };
    $scope.genres = ["Rock", "Pop", "Classique", "Jazz", "Soul", "Rap", "Country", "Reggae"];


    /** Uploader object **/

    $scope.uploader = new FileUploader({
      url: CONFIG.baseUrlApi + '/upload'
    });


    /** Set file uploader music filter **/

    $scope.uploader.filters.push({
      name: 'soundFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|mp3|'.indexOf(type) !== -1;
      }
    });


    /** Upload music **/

    $scope.upload = function () {
      $scope.uploader.upload();
    };


    /** Cancel the upload process **/

    $scope.cancel = function () {
      $scope.uploader.cancel();
    };


    /** Remove the upload process **/

    $scope.remove = function () {
      $scope.uploader.remove();
    };


    /** Create a folder with tracks **/

    $scope.sendFolder = function (name) {
      var deferred = $q.defer();
      $http.get(CONFIG.baseUrlApi + '/folderName', {params: {f: name}})
        .success(function (data) {
          deferred.resolve(data);
        }).error(function (data) {
          deferred.reject(false);
        });
      return deferred.promise;
    };


    /** Valid upload **/

    $scope.valid = function () {
      $scope.sendFolder($scope.data.titre).then(function (data) {
        $scope.uploader.uploadAll();
        CONFIG.LOAD_SONGS.push($scope.data);
      }, function (msg) {
        //
      });
    };

    /** Update genre **/

    $scope.changeGenre = function (i) {
      $scope.data.genre = i;
    };

  });
