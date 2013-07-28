'use strict';

app.controller('NavCtrl', ['$scope','Auth','$http',function ($scope,Auth,$http) {
  $scope.logout = function(){
    Auth.logout();
  }
  $scope.test = function(){
    $http.get('/api/test').success(function(data){
      console.log(data);
    });
  }
}]);
