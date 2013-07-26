'use strict';

app.controller('RegisterCtrl', ['$scope','$location','Auth',function ($scope,$location,Auth) {

  $scope.register = function(){
    Auth.register({
      email: $scope.email,
      password: $scope.password,
      name: $scope.name
    },
    function(res){
      $location.path('/');
    },
    function(err){
      console.log("error");
      console.log(err);
    });
  };
}]);
