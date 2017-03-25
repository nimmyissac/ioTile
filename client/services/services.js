angular.module("services", []) 
.factory('authInterceptor', function ($rootScope, $q, $window) {
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
})
.factory("Auth", function($http, $window, $location) {
  var signin = function(username, password) {
    return $http.post('https://iotile.cloud/api/v1/auth/api-jwt-auth/', {
      username: username,//'user1@test.com',
      password: password//'user.1'
    })
    .then(function(resp, error) {
      return resp.data.token;  
    });
  };

  var signout = function() {
    $window.localStorage.removeItem('com.IOTile');
    $location.path('/signin');
  };

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.IOTile');
  }
  return {
    signin: signin,
    isAuth: isAuth,
    signout: signout
  };

})
.factory("Projects", function($http, $window) {
  console.log("token ---");
  console.log($window.localStorage.getItem('com.IOTile'));
   return {
    getProjects: function() {
      return $http({
        'method' : "GET",
        'url' : "https://iotile.cloud/api/v1/project/",
        'Content-Type': 'application/json',
        //'Authorization': 'Bearer ' + $window.localStorage.getItem('com.IOTile')
        
       }).then(function mySucces(response) {
          console.log("success ", response);
          return response.data;
       }, function myError(response) {
        console.log("Error");
        console.log(response);
       });
  },
  getProjectDetails: function(project) {
    return $http({
        'method' : "GET",
        'url' : "https://iotile.cloud/api/v1/project/"+project.id+"/",
       // "Access-Control-Allow-Credentials": "true",
        'Content-Type': 'application/json',
        //'Authorization': "JWT "+$window.localStorage.getItem('com.IOTile')
        
       }).then(function mySucces(response) {
          console.log("project details successss", response);
          return response;
       }, function myError(response) {
        console.log("Error in fetching project details");
        console.log(response);
       });
 }
 }
})
.factory("Streams", function($http) {

   return {
     streamsPerProject: [],
     projectName:"",
     getStreams: function() {
       return $http({
        'method' : "GET",
        'url' : "https://iotile.cloud/api/v1/stream/",
        'Content-Type': 'application/json',
       }).then(function mySucces(response) {
          console.log("success inside stream", response);
          return response.data;
       }, function myError(response) {
        console.log("Error");
        console.log(response);
       });
     },
     getStreamsOfProject: function(projectDetails, projectId, name) {
       console.log("inside getStreamsOfProject");
       this.streamsPerProject = [];
       this.projectName = name;
       var that = this;
       return (this.getStreams().then(function(streams) {
              streams.results.forEach(function(element) {
                console.log("element.project_id ", element.project_id)
                if(element.project_id === projectId) {
                  that.streamsPerProject.push(element);

                }
              });
              return this.streamsPerProject;
       }))
       
     }
   }
 });
  

 