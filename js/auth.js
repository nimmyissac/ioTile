angular.module('authModule', [])
.controller('AuthController', function($scope, $window, $location, Auth) {
  $scope.signin = function(username, password) {

    Auth.signin(username, password)
    .then(function (token) {
      $window.localStorage.setItem('com.IOTile', token);
      $location.path('/projects');
    })
    .catch(function (error) {
      console.error(error);
    });
  }
});