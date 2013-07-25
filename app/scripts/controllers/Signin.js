'use strict';

app.controller('SigninCtrl', ['$rootScope','$scope','$location','$window','Auth',function ($rootScope,$scope,$location,$window,Auth) {

  $scope.login = function(){
    Auth.login({
      email: $scope.email,
      password: $scope.password,
      rememberme: $scope.rememberme
    },
    function(res){
      $location.path('/');
    },
    function(err){
      $location.error = "Failed to login"
    });
  };
  /*
  $scope.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };
  */
}]);
