'use strict';

/**
 * @ngdoc directive
 * @name frontendApp.directive:compareTo
 * @description
 * # compareTo
 */
angular.module('frontendApp')
  .directive('compareTo', function () {
    return {
      require: "ngModel",
      scope: {
        compareTo: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.compareTo || ctrl.$viewValue) {
               combined = scope.compareTo + '_' + ctrl.$viewValue; 
            }                    
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.compareTo;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("compareTo", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("compareTo", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
  });
