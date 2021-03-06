'use strict';

app.controller('SigninCtrl', ['$scope','$location','$timeout','Auth',function ($scope,$location,$timeout,Auth) {
  $scope.login = {};

  $scope.nouser = false;
  $scope.invalid_password = false;

  $scope.submitLogin = function(){
    Auth.login({
      email: $scope.login.email,
      password: $scope.login.password,
      rememberme: $scope.login.rememberme
    },
    function(res){
      $location.path('/home');
    },
    function(data){
      console.log(data);
      if (data.error === "user doesnt exist"){
        $scope.nouser = true;
        $timeout(function(){
          $scope.nouser = false;
        },3000);
      }
      if (data.error === "invalid password"){
        $scope.invalid_password = true;
        $timeout(function(){
          $scope.invalid_password = false;
        },3000);
      }
    });
  };

  //Login to demo account
  $scope.demo = function demo(){
    $scope.login.email = "test@test.com";
    $scope.login.password = "derp";
    $scope.login.rememberme = false;
    $scope.submitLogin();
  };

}]);
