'use strict';

angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, notification, CONFIG, ModalService,
                                    searchService,currentMix, currentMusicService, feedbackService,auth, follow,$http,$q,$rootScope,user) {

    // initialisation

    //User Info:
    $scope.following = [];
    $scope.myMix = [];
    $scope.followers = [];
    $scope.news = [];
    $scope.email = null;
    $scope.currentSong = {};
    $scope.currentSong.comment = ["No comment yet!"];
    $scope.currentSong.myComment = "";
    $scope.currentSong.myMark = null;

    user.getUserById(auth.id).then(function(data){
          $scope.news = data.events;
          $scope.followers = data.followers;
          $scope.following = data.following;
          $scope.email = data.email;
          $scope.myMix = data.songs;
          $scope.avatar = data.avatar;
          $scope.created_at = auth.created_at;
        }, function(msg){
          console.log('erreur promesses : ' + msg);
        });


    $scope.isTabMenuNewsSelected = true;

    user.myMix(auth.id).then(function(data){
      console.log(data);
      $scope.myMix = data;
    },function(msg){
      console.log('erreur promesses : ' + msg);
    });

    $scope.searchQuery = "";
    $scope.searchResults = {};

    $scope.search = function(query) {
      searchService.search(query).then(function(data){
        //$scope.results = data;
        if((data.songs.length === 0) && (data.users.length === 0)) {
          notification.writeNotification(
            {
              status: CONFIG.JSON_STATUS_NOTICE,
              title: 'Search',
              message: 'There is no result!'
            }
          );
        }
        $scope.searchResults = data;

      },function(msg){
        console.log('erreur promesses : ' + msg);
      });
    };

    $scope.follow = function(user) {
        follow.follow(auth.id, user._id).then(function(data){
          $scope.following = data.following;
          $scope.news = data.events;
          //$scope.following.push(user);
        },function(msg){
          console.log('erreur promesses : ' + msg);
        });
    };

    $scope.unfollow = function(user) {
      follow.unfollow(auth.id, user._id).then(function(data){
        $scope.following = data;
        //$scope.following.splice($scope.following.indexOf(user), 1);
      },function(msg){
        console.log('erreur promesses : ' + msg);
      });
    };

    $scope.seeProfil = function(userId) {
      alert("seeProfil : " + userId);
    };

    $scope.date = function(time){
      var d = new Date(time);
      return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
    };

    $scope.hour = function(time){
      var d = new Date(time);
      return d.getHours()+':'+ d.getMinutes();
    };

  $scope.addComment = function(comment){
    feedbackService.addComment($scope.currentSong._id, comment).then(function(data){
      $scope.currentSong.comment.splice($scope.currentSong.comment.indexOf($scope.currentSong.myCommentOld), 1);

      $scope.currentSong.comment.push(comment);

      $scope.currentSong.myComment = comment;
      $scope.currentSong.myCommentOld = comment;

    },function(msg){
      console.log('erreur promesses : ' + msg);
    });
  };

  $scope.addMark = function(mark){
    feedbackService.addMark($scope.currentSong._id, mark).then(function(data){
      console.log(data.data);
      $scope.currentSong.myMark = mark;
      $scope.currentSong.markAvg = data.data;

    },function(msg){
      console.log('erreur promesses : ' + msg);
    });
  };

  // play a music call .wav it's just for example
  $scope.getAndPlayMix = function (mix) {

    currentMix.getMix(mix).then(function(data){
      $scope.currentSong = data.data;
      console.log(auth.id);
      //console.log(data.data.feedbacks[0]._id);


      $scope.currentSong.comment = data.data.feedbacks.map(function(currentValue, index, array) {
          return currentValue.comment;
      });

      var element = data.data.feedbacks.map(function(x) { return x._id.toString(); }).indexOf(auth.id);
      if(element === -1){
        $scope.currentSong.myComment = "";
        $scope.currentSong.myMark = null;
      } else {
        $scope.currentSong.myMark = data.data.feedbacks[element].mark;
        $scope.currentSong.myComment = data.data.feedbacks[element].comment;
        $scope.currentSong.myCommentOld = data.data.feedbacks[element].comment;
      }

      $scope.play('http://localhost:3000/' + data.data.path);

      //console.log(data.data);
    },function(msg){
      console.log('erreur promesses : ' + msg);
    });
  }

  // Mise en place du player
  var activeUrl = null;

  $scope.paused = true;

  $scope.$on('wavesurferInit', function (e, wavesurfer) {
      $scope.wavesurfer = wavesurfer;

      $scope.wavesurfer.on('play', function () {
          $scope.paused = false;
      });

      $scope.wavesurfer.on('pause', function () {
          $scope.paused = true;
      });

      $scope.wavesurfer.on('finish', function () {
          $scope.paused = true;
          $scope.wavesurfer.seekTo(0);
          $scope.$apply();
      });
  });

  $scope.play = function (url) {

      if (!$scope.wavesurfer) {
          return;
      }

      activeUrl = url;

      $scope.wavesurfer.once('ready', function () {
          $scope.wavesurfer.play();
          $scope.$apply();
      });

      $scope.wavesurfer.load(activeUrl);
  };

  $scope.isPlaying = function (url) {
      return url == activeUrl;
  };

});
