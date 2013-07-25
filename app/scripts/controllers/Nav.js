'use strict';

app.controller('NavCtrl', ['$scope','Auth',function ($scope,Auth) {
  $scope.logout = function(){
    Auth.logout();
  }
}]);
