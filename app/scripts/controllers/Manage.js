'use strict';

app.controller('ManageCtrl', ['$scope','Table',function ($scope,Table) {
  $scope.tables = Table.getAllTables();
  $scope.update = function(){
    console.log($scope.tables);
  }
}]);
