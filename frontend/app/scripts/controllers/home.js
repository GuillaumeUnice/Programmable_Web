'use strict';

angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, notification, CONFIG, ModalService, searchService,currentMusicService, feedbackService,auth, follow) {
    // initialisation

   // $scope.
    $scope.followers = [];
    $scope.following = [];

    $scope.myMix = [
      { _id: 1,
        name: "Drop The Pressure",
        created_at: 1454616841
      },
      { _id: 2,
        name: "Metronome",
        created_at: 1454616842
      },
      { _id: 3,
        name: "Freaky Voice",
        created_at: 1454616843
      },
      { _id: 6,
        name: "Turn The World On",
        created_at: 1454616846
      },
      { _id: 4,
        name: "Close Encounter",
        created_at: 1454616844
      },
      { _id: 5,
        name: "Pumped Up Kicks",
        created_at: 1454616845
      },
      { _id: 7,
        name: "Turn The World On 2",
        created_at: 1454616847
      },
    ];

    /*$scope.followers = [
      { _id: 1,
        name: "Henry Dupont",
        created_at: 1454616841
      },
      { _id: 2,
        name: "Henry Durant",
        created_at: 1454616842
      },
      { _id: 3,
        name: "Butch Clancy",
        created_at: 1454616843
      },
      { _id: 6,
        name: "Jhon Smith",
        created_at: 1454616846
      }
    ];*/
    $scope.news = [];
    $scope.getNews = function(){

    }
    /*$scope.news = [
      { _id: 1,
        name: "Henry Dupont",
        action: "a commenté",
        music: "Pumped Up Kicks",
        author: "Jhon Doe",
        created_at: 1454616841,
        glyphicon: 'glyphicon-comment'
      },
      { _id: 2,
        name: "Henry Durant",
        action: "a édité commentaire",
        music: "Pumped Up Kicks",
        author: "Jhon Doe",
        created_at: 1454616842,
        glyphicon: 'glyphicon-comment'
      },
      { _id: 3,
        name: "Butch Clancy",
        action: "a noté",
        music: "Close Encounter",
        author: "Mylo",
        created_at: 1454616843,
        glyphicon: 'glyphicon-certificate'
      },
      { _id: 4,
        name: "Butch Clancy",
        action: "a modifié sa note",
        music: "Close Encounter",
        author: "Mylo",
        created_at: 1454616844,
        glyphicon: 'glyphicon-certificate'
      },
      { _id: 5,
        name: "Butch Clancy",
        action: "a follow",
        music: "",
        author: "Mylo",
        created_at: 1454616845,
        glyphicon: 'glyphicon-thumbs-up'
      },
      { _id: 6,
        name: "Butch Clancy",
        action: "ne follow plus",
        music: "Close Encounter",
        author: "Mylo",
        created_at: 1454616846,
        glyphicon: 'glyphicon-thumbs-down'
      },
      { _id: 7,
        name: "Mylo",
        action: "a ajouté un mix",
        music: "Close Encounter",
        author: "Mylo",
        created_at: 1454616847,
        glyphicon: 'glyphicon-volume-up'
      },
      { _id: 8,
        name: "Mylo",
        action: "a édité un mix",
        music: "Close Encounter",
        author: "Mylo",
        created_at: 1454616848,
        glyphicon: 'glyphicon-volume-up'
      },
      { _id: 9,
        name: "Mylo",
        action: "a supprimé un mix",
        music: "Close Encounter",
        author: "Mylo",
        created_at: 1454616849,
        glyphicon: 'glyphicon-volume-up'
      }
    ];

    $scope.isTabMenuNewsSelected = true;

    follow.getFollowing("56b4e07045b766bd49eb5d63").then(function(data){
      $scope.following = data;
    },function(msg){
      console.log('erreur promesses : ' + msg);
    });

    follow.getFollowers("56b4e07045b766bd49eb5d63").then(function(data){
      $scope.followers = data;
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
          $scope.following.push(data);
        },function(msg){
          console.log('erreur promesses : ' + msg);
        });
    }

    $scope.unfollow = function(user) {
      follow.unFollow(auth.id, user._id).then(function(data){
        $scope.followers.splice($scope.followers.indexOf(user), 1);
      },function(msg){
        console.log('erreur promesses : ' + msg);
      });
    }

    $scope.seeProfil = function(userId) {
      alert("seeProfil : " + userId);
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

  $scope.addComment = function(){
    alert("addComment");
  };
});
