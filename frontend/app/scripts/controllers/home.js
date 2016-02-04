'use strict';

angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, ModalService, searchService,currentMusicService, feedbackService,auth) {
    
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


    /*$scope.searchInfo = {motsCles: null};
    $scope.results = [];
    $scope.chosenMusic = null;

    $scope.sendKeyWords = function() {
      searchService.search($scope.searchInfo).then(function(data){
        $scope.results = data;
      },function(msg){
        console.log('erreur promesses : ' + msg);
      });
    };

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


});
