'use strict';

/**
 * @ngdoc service
 * @name frontendApp.user
 * @description
 * # user
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .factory('currentMusicService', function () {
    var data = {
      title: '',
      feedbacks: []
    };

    return {
      getTitle: function () {
        return data.title;
      },
      setTitle: function (title) {
        data.title = title;
      },
      getFeedbacks: function () {
        return data.feedbacks;
      },
      setFeedbacks: function (feedbacks) {
        data.feedbacks = feedbacks;
      }
    };
  });
