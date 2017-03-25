angular.module("streamModule",[])
.controller("StreamController", function($scope, Streams) {
   $scope.streams = Streams.streamsPerProject;
   $scope.projectName = Streams.projectName;
   console.log($scope.streams);
});