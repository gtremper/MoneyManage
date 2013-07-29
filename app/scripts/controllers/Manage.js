'use strict';

app.controller('ManageCtrl', ['$scope','Table',function ($scope,Table) {
  $scope.tables = Table.getTableNames();
  $scope.changeTable = function(id){
    Table.changeTable(id);
  }
  $scope.update = function(){
    console.log("update");
    $scope.tables = Table.getTableNames();
  }
}]);
