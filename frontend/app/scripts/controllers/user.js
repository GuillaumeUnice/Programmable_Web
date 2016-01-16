'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('UserCtrl', function ($scope, $location, $window, user, auth) {
    $scope.logIn = function logIn(username, password) {
        if (username !== undefined && password !== undefined) {


            user.logIn(username, password)
                .then(function(data){
                    auth.isLogged = true;
                    $window.sessionStorage.token = data.token;
                    $location.path("/");
                }, function(msg){
                    console.log('erreur promesses : ' + msg);
                });
        }
    };

    $scope.logout = function logout() {
        if (auth.isLogged) {
            auth.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path("/");
        }
    };

  });

/*
'use strict';
=======

>>>>>>> d657e671284c9ea58588f24ae5d48becf9d32171

/**
 * @ngdoc function
 * @name frontendApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the frontendApp
 *//*
angular.module('frontendApp')
  .controller('UserCtrl', ['$scope', '$location', '$window', 'user',
    function UserCtrl($scope, $location, $window, user) {

    $scope.logIn = function logIn(username, password) {
        if (username !== undefined && password !== undefined) {


            user.logIn(username, password)
                .then(function(data){
                    //auth.isLogged = true;
                    $window.sessionStorage.token = data.token;
                    $location.path("/");
                }, function(msg){
                    console.log('erreur promesses : ' + msg);
                });
        }
    };

    $scope.logout = function logout() {
        if (auth.isLogged) {
            //auth.isLogged = false;
            delete $window.sessionStorage.token;
            $location.path("/");
        }
    };
  }
]);
*/
