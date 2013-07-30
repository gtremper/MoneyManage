'use strict';

app.controller('HomeCtrl', ['$scope','Table',function ($scope,Table) {
  $scope.test = Table.getValue();
  $scope.change = function(){
    $scope.test.value++;
  }
}]);
