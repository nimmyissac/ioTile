console.log("entering java");
var myApp = angular.module('app', ["ngRoute"]);
myApp.controller('Main', MainCtrl);
myApp.config(function($routeProvider,  $httpProvider) {
    $routeProvider
    .when("/login", {
        templateUrl : "client/login.html"
        
    })
    .when("/projects", {
        templateUrl : "client/projects.html",
        controller: 'Main'
    })
    .when("/streams", {
        templateUrl : "client/streams.html",
        controller: 'Main'
    })
    .otherwise({
      redirectTo: '/login'
    });;
    $httpProvider.interceptors.push('authInterceptor');
});



function MainCtrl($scope, $http, $window) {
 $scope.token = "";
 $scope.getToken = function(username, password) {
  return $http.post('https://iotile.cloud/api/v1/auth/api-jwt-auth/', {
      username: $scope.username,//'user1@test.com',
      password: $scope.password//'user.1'
  })
  .success(function(response) {
      $scope.token = response.token;
      $window.sessionStorage.token = response.token;
  }).error(function(response) {
      console.log("Error");
      console.log(response);
  });;

};
$scope.getProjects = function() {
  $http({
        'method' : "GET",
        'url' : "https://iotile.cloud/api/v1/project/",
        //'Authorization': 'JWT ' + $scope.token,
        'Content-Type': 'application/json'
       }).then(function mySucces(response) {
          console.log("success ", response);
          $scope.projects = response.data.results;
          console.log("success ", $scope.projects);
       }, function myError(response) {
        console.log("Error");
        console.log(response);
       });
  
}
}

myApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'JWT ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

myApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

