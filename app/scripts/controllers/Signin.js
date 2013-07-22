'use strict';

app.controller('SigninCtrl', ['$rootScope','$scope','$location','$window','Auth',function ($rootScope,$scope,$location,$window,Auth) {
  //$scope.rememberme = true;
  $scope.login = function(){
    Auth.login({
      username: $scope.username,
      password: $scope.password
    },
    function(res){
      $location.path('/');
    },
    function(err){
      $location.error = "Faild to login"
    });
  };
});
