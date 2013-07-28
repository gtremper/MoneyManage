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
    function(data,status){
      console.log(data);
      console.log(status);
    });
  };
  /*
  $scope.loginOauth = function(provider) {
    $window.location.href = '/auth/' + provider;
  };
  */
}]);
