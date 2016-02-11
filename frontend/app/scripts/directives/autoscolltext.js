'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:autoScollText
 * @description
 * # autoScollText
 */
angular.module('frontendApp')
  .directive('autoScollText', function ($interval) {
    return {
      template: '<div>{{comment}}</div>',
      restrict: 'E',
      scope: {
      	comments: '='
      },
      link: function postLink(scope, element, attrs) {

      	var rang = (scope.comments.length-1 > 0) ? scope.comments.length-1 : null;
      	if(rang !== null) {
      		scope.comment = scope.comments[rang];
      	} else {
      		scope.comment = "No comment yet!"
      	}

		$interval(function() {
			if(rang !== null || (scope.comments.length-1 === 0)) {
				rang--;
				if(rang >= 0) {
	        		scope.comment = scope.comments[rang];
	        	} else {
	        		rang = scope.comments.length-1;
	        		scope.comment = scope.comments[rang];
	        	}
			}
    	}, 4000);
      }
    };
  });
