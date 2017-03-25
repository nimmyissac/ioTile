var myApp = angular.module('app', [
  "services",
  "authModule",
  "projectModule",
  "streamModule",
  "ngRoute"
]);
myApp.controller('Main', function($scope) {
  console.log("Entered main controller function");
});
myApp.config(function($routeProvider, $httpProvider) {
    $routeProvider
    .when("/login", {
        templateUrl : "client/html/login.html",
        controller: 'AuthController'
        
    })
    .when("/projects", {
        templateUrl : "client/html/projects.html",
        controller: 'ProjectController'
    })
    .when("/streams", {
        templateUrl : "client/html/streams.html",
        controller: 'StreamController'
    })
    .otherwise({
      redirectTo: '/login'
    });;
  })
.run(function ($rootScope, $location, Auth) {
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin');
    }
  });
});


myApp.config(['$httpProvider', function ($httpProvider)
{
    $httpProvider.interceptors.push([ '$q', '$location', '$window', function ( $q, $location, $window )
    {
        return {
            'request': function ( config )
            {
                config.headers = config.headers || {};
                if ( $window.localStorage.getItem('com.IOTile') )
                {
                    config.headers.Authorization = 'JWT ' + $window.localStorage.getItem('com.IOTile');
                }
                return config;
            },
            'responseError': function ( response )
            {
                if ( response.status === 401 || response.status === 403 )
                {
                    delete $localStorage.token;
                    $location.path( '/signin' );
                }
                return $q.reject( response );
            }
        };
    } ] );
} ] )





