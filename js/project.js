angular.module("projectModule",[])
.controller("ProjectController", function($scope, $location, Projects, Streams) {
   $scope.projects = [];
   $scope.streams = [];
   Projects.getProjects()
   .then(function(response) {
      console.log(response);
      $scope.projects = response.results;
      $scope.getProject = function(project) {
       Projects.getProjectDetails(project)
         .then(function(response) {
          console.log("project is ", project.id);
          Streams.getStreamsOfProject(response.data, project.id, project.name)
          .then(function() {
             $location.path('/streams');
          });
       });
      }
   });
});