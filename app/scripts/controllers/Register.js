'use strict';

app.controller('RegisterCtrl', ['$scope','$location','$timeout','Auth',function ($scope,$location,$timeout,Auth) {

  $scope.newuser = {};
  $scope.userExists = false;

  $scope.register = function(){
    Auth.register({
      email: $scope.newuser.email,
      password: $scope.newuser.password,
      name: $scope.newuser.name
    },
    function(res){
      $location.path('/#manage');
    },
    function(data){
      $scope.newuser.email = '';
      $scope.newuser.password = '';
      if (data.error === "user already exists"){
        $scope.userExists = true;
        $timeout(function(){
          $scope.userExists = false;;
        },3000);
      };
    });
  };
}]);
