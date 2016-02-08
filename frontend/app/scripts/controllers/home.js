'use strict';

angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, notification, CONFIG, ModalService,
                                    searchService,currentMix, currentMusicService, feedbackService,auth, follow,$http,$q,$rootScope,user) {

    // initialisation

   // $scope.
    /*$scope.isLogged = false;
    $scope.updateAuth = function(){
      $scope.isLogged = auth.isLogged;
      $scope.idUser = auth.id;
    };
    auth.registerObserverCallback(updateAuth);*/

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

  /*  $scope.getMixedSongs = function(){
      var deferred = $q.defer();
      $http.get(CONFIG.baseUrlApi + '/getmixed')
        .success(function (data) {
          //notification.writeNotification(data);
          deferred.resolve(data);
          for(var i =0; i<data.message.length;i++) {
            $scope.myMix.push({_id :i,name_new : data.message[i].name_new, name: data.message[i].name,created_at: 1454616846});
          }
            console.log(data.message);
        }).error(function (data) {
          //notification.writeNotification(data);
          deferred.reject(false);
        });
      return deferred.promise;
    };*/

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

    /*follow.getFollowing(auth.id).then(function(data){
      $scope.following = data;
    },function(msg){
      console.log('erreur promesses : ' + msg);
    });

    follow.getFollowers(auth.id).then(function(data){
      $scope.followers = data;
    },function(msg){
      console.log('erreur promesses : ' + msg);
    });
*/
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

    /*
    $scope.chosenMusic = null;

    $scope.startListening = function(result){
      $scope.chosenMusic = result;
    };

    $scope.$watch('chosenMusic', function (newValue, oldValue) {
      if (newValue !== oldValue){
        if(oldValue===null){
          currentMusicService.setTitle(newValue.name);
        }
        var mixFeedback = [];
        for(var i= 0; i<newValue.feedbacks.length; i++){
          mixFeedback.push(newValue.feedbacks[i].comment);
        }
        console.log(mixFeedback);
        currentMusicService.setFeedbacks(mixFeedback);
      }
    });

    $scope.addComment = function(){
      ModalService.showModal({
          templateUrl: "views/addComment.html",
          controller: function($scope,close,id){
            $scope.myComment = null;
            $scope.myMark = null;
            $scope.valider = function(){
              feedbackService.sendComment(id,{user:auth.username, mark: $scope.myMark, comment:$scope.myComment});
              close(null,500);
            };
            $scope.annuler = function(){
              close(null,500);
            }
          },
        inputs: {
          id: $scope.chosenMusic.id
        }
        }).then(function(modal) {
          modal.element.modal();
          modal.close.then(function(){});
        });
    };*/

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

  $scope.test = function (mix) {

    currentMix.getMix(mix).then(function(data){
      $scope.currentSong = data.data;
      console.log(auth.id);
      console.log(data.data.feedbacks[0]._id);


      $scope.currentSong.comment = data.data.feedbacks.map(function(currentValue, index, array) {
          return currentValue.comment;
      });

      console.log($scope.currentSong.comment);



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
