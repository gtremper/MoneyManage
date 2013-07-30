'use strict';

app.controller('SigninCtrl', ['$scope','$location','Auth',function ($scope,$location,Auth) {

  $scope.login = function(){
    Auth.login({
      email: $scope.email,
      password: $scope.password,
      rememberme: $scope.rememberme
    },
    function(res){
      $location.path('/manage');
    },
    function(data,status){
      console.log(data);
      console.log(status);
    });
  };

}]);
