'use strict';

app.controller('SigninCtrl', ['$rootScope','$scope','$location','$window','Auth',function ($rootScope,$scope,$location,$window,Auth) {

  $scope.login = function(){
    Auth.login({
      username: $scope.username,
      password: $scope.password
    },
    function(res){
      $location.path('/');
    },
    function(err){
      $location.error = "Failed to login"
    });
  };
  $scope.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };
}]);
