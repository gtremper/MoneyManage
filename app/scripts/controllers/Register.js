'use strict';

app.controller('RegisterCtrl', ['$scope','$location','Auth',function ($scope,$location,Auth) {

  $scope.register = function(){
    Auth.register({
      email: $scope.email,
      password: $scope.password,
      name: $scope.name
    },
    function(res){
      console.log("REDIRECT");
      $location.path('/');
    },
    function(err){
      $location.error = "Failed to login"
    });
  };
}]);