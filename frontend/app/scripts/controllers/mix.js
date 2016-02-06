'use strict';


/**
 * @ngdoc function
 * @name frontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')

  .controller('MixCtrl', function ($scope,$rootScope, user,mix, CONFIG,FileUploader,ModalService) {

    //** Scope
    /**=========================**/
    $scope.buf = []; $scope.listSongs = []; $scope.listTracks = []; $scope.data = [];
    $scope.isPlaying = false; $scope.canPlay = false; $scope.canStop = true; $scope.showPlayButton = true;
    $scope.song = null;
    $scope.mixTable = false;
    $scope.displayLoading = false;
    $scope.loadSong = true;
    $scope.filters = ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"];

    $( "#progressbar" ).progressbar({
      value: 0
    });

    //** Modal
    /** =============== **/
    $scope.showComplex = function() {

      ModalService.showModal({
        templateUrl: "../views/selectSong.html",
        controller: "MixtCtrl",
        inputs: {
          title: "Selectionnez une musique"
        }
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          $scope.loadSong = false;
          $scope.displayLoading = true;
          $scope.getAllTracks(result.name);
          $scope.song = result.name;
        });
      });

    };

    $scope.init = function () {
      mix.init(function(b){
        $rootScope.listSongs =b;
      });
    };

    $scope.getAllTracks = function(name) {
      //$scope.spinner = {active : true};
      mix.getAllTrackList(name, function(b){
        for(var i = 0; i < b.length; i++ ) {
          $scope.data[i] = {
            "gain" : 0.5,
            "gainL" : 0,
            "frequence" : 5000,
            "gainR" : 0
          };
        }
        $scope.listTracks =b;
      }, function(a){
        //$scope.spinner = {active : false};
        $scope.buf = a;
        $scope.displayLoading = false;
        $scope.mixTable = true;
        $scope.$apply();
        console.log("Finis de charger");
      });
    };

    $scope.play = function(n) {
      $scope.showPlayButton = false;
      if($scope.isPlaying){
        mix.pauseReplayAllTracks($scope.buf);
      }else{
        $scope.isPlaying = true;
        mix.playAT($scope.buf,n);
      }
    };

    $scope.pause = function () {
      $scope.showPlayButton = true;
      mix.pauseAT($scope.buf);
    };

    $scope.stop = function () {
      mix.stopAT($scope.buf);
    };

    $scope.changerangeslide = function (num) {
      console.log('changerangeslide');
      mix.changeRS(num);
    };

    /*****************/

    $scope.setMasterGain = function (val) {
      mix.setMasterGain(val);
      setAllGain(val);
    };

    $scope.setMasterStereo = function (val) {
      mix.setMasterStereo(val);
      setAllStereo(val);
    };

    $scope.setGain = function (i, val) {
      mix.setGain(i, val);
    };

    $scope.setMonoR = function (i, val) {
      mix.setMonoR(i, val);
    };

    $scope.setMonoL = function (i, val) {
      mix.setMonoL(i, val);
    };

    $scope.setFrequence = function (i,val) {
      mix.setFilterFrequency(i,val);
    };

    $scope.setCompressor = function (i) {
      mix.setCompressor(i);
    };



    $scope.setDetune = function (i,val) {
      mix.setFilterDetune(i,val);
    };

    $scope.setQuality = function (i,val) {
      mix.setFilterQuality(i,val);
    };

    $scope.setType = function (val) {
      mix.setFilterType(val);
    };

    function setAllGain(val) {
      var myL = $scope.data.length;
      for(var i = 0; i < myL; i++ ){
        $scope.data[i].gain = val;
      }
    }

    function setAllStereo(val) {
      var myL = $scope.data.length;
      for(var i = 0; i < myL; i++ ){
        $scope.data[i].stereo = val;
      }
    }

    /*************************/


    $scope.mute = function(i, val){
      var a = $scope.data[i].mute;
      $scope.data[i].mute = !a;
    };


    /*** PAS COMPRIS **/

    $scope.save = function save(str) {
      if (str !== undefined && str !=="" ) {
        //console.log(uri);
        user.saveInfo(str);
      }else{
        alert("cann't be empty");
      }
    };

    $scope.get = function get(str) {
      if (str !== undefined && str !=="" ) {
        //console.log(uri);
        user.getInfo(str);
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

    $scope.muteUnmuteTrack = function () {
      console.log('muteUnmuteTrack');
      mix.muteUnmuteTrack();
    };
    $scope.loadOneSong = function (name) {
      console.log('loadSong');
      mix.loadOS(name);
    };
    $scope.pppp = function(){
      mix.combine($scope.buf);
    };

  })
  .controller('MixtCtrl', function ($scope,$rootScope, $element, title, close, mix) {
    $scope.title = title;
    $scope.songs = $rootScope.listSongs;

    $scope.name = null;

    $scope.setSelected = function (idSelectedVote) {
      $scope.name = idSelectedVote;
    };

    //  This close function doesn't need to use jQuery or bootstrap, because
    //  the button has the 'data-dismiss' attribute.
    $scope.charger = function() {
      close({
        name: $scope.name
      }, 500); // close, but give 500ms for bootstrap to animate
    };
  });

