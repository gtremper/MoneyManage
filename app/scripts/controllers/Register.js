'use strict';

app.controller('RegisterCtrl', ['$scope','$location','Auth',function ($scope,$location,Auth) {

  $scope.register = function(){
    Auth.register({
      email: $scope.email,
      password: $scope.password,
      name: $scope.name
    },
    function(res){
      $location.path('/manage');
    },
    function(data,status,headers,config){
      console.log("error");
      console.log(data);
      console.log(status);
    });
  };
}]);
