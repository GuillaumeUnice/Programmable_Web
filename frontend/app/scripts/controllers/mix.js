'use strict';


/**
 * @ngdoc function
 * @name frontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')

  .controller('MixCtrl', function ($scope, user,CONFIG,FileUploader) {


    $scope.priceSliders = [
      {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }, {
        value: 50,
        options: {
          floor: 0,
          ceil: 100,
          vertical: true
        }
      }];


    $scope.default = function() {
      var l = $scope.priceSliders.length;
      for( var i = 0 ; i < l ; i ++ ) {
        $scope.priceSliders[i].value = CONFIG.MIX_DEFAULT_SOUND;
      }
    }

    $scope.save = function save(str) {
      if (str !== undefined && str !=="" ) {
        //console.log(uri);
        user.saveInfo(str);
      }else{
        alert("cann't be empty");
      }
    };

    $scope.download = function download(uri) {

      //user.download('kkk');

    };

    $scope.uploader = new FileUploader({
      url: CONFIG.baseUrlApi + '/upload'
    });
    // Set file uploader music filter
    $scope.uploader.filters.push({
      name: 'soundFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|mp3|'.indexOf(type) !== -1;
      }
    });
    $scope.uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
    };

    // Upload music
    $scope.upload = function () {
      // Clear messages
      console.log('update');
      //$scope.success = $scope.error = null;
      // Start upload
      $scope.uploader.upload();
    };

    // Cancel the upload process
    $scope.cancel = function () {
      $scope.uploader.cancel();
      //$scope.imageURL = $scope.user.profileImageURL;
    };

    // Remove the upload process
    $scope.remove = function () {
      $scope.uploader.remove();
      //$scope.imageURL = $scope.user.profileImageURL;
    };

  });

