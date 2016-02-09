'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('UserCtrl', function ($scope, $location, $window, user, auth, notification, CONFIG) {

    $scope.logIn = function logIn(login) {
        user.logIn(login)
            .then(function(data){
                console.log(data.data);
                auth.isLogged = true;
                auth.username = data.data.email;
                auth.full_name = data.data.full_name;
                auth.id = data.data._id;
                auth.created_at = data.data.created_at;
                auth.notifyObservers();
                //auth.full_name = data.data.full_name;
               // auth.name = data.data.name;
               // auth.first_name = data.data.first_name;

                $window.sessionStorage.token = data.token;
                $location.path("/");
            }, function(msg){
                console.log('erreur promesses : ' + msg);
            });
    };

    $scope.signUp = function signUp(register) {
        user.register(register)
            .then(function(data){
                console.log(data);
                if(data.status === CONFIG.JSON_STATUS_SUCCESS) {
                    $location.path("/login");
                }
            }, function(msg){
                console.log('erreur promesses : ' + msg);
            });
    };

    $scope.logout = function logout() {
        if (auth.isAuthenticated) {
        user.logout()
            .then(function(data){
                auth.isLogged = false;
                auth.isAuthenticated = false;
                delete $window.sessionStorage.token;
                $location.path("/login");
            }, function(msg){
                console.log('erreur promesses : ' + msg);
            });
        }
    };

});
