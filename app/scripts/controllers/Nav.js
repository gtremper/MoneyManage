'use strict';

app.controller('NavCtrl', ['$scope','Auth','Table',function ($scope,Auth,Table) {
  $scope.logout = function(){
    Auth.logout();
  }

}]);
