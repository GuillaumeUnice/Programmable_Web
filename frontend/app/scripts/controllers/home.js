'use strict';

angular.module('frontendApp')
  .controller('HomeCtrl', function ($scope, ModalService, searchService,currentMusicService, feedbackService) {
    $scope.searchInfo = {motsCles: null};
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
        currentMusicService.setTitle(newValue.name);
        currentMusicService.setFeedbacks(newValue.feedbacks);
      }
    });

    $scope.addComment = function(){
      ModalService.showModal({
          templateUrl: "views/addComment.html",
          controller: function($scope,close){
            $scope.comment = null;
            $scope.valider = function(){
              feedbacksService.sendComment(1,{user:"Ahmed", mark: 10, comment:"Excellent!"});
              close(null,500);
            };
            $scope.annuler = function(){
              close(null,500);
            }
          },
         /* inputs : {
            ids: myIds
          }*/
        }).then(function(modal) {
          modal.element.modal();
          //modal.close.then(action);
          modal.close.then(function(){});
        });
    };

  });
