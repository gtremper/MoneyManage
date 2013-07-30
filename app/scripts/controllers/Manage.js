'use strict';

app.controller('ManageCtrl', ['$rootScope','$scope','Table',function ($rootScope,$scope,Table) {
  $scope.tables = Table.getAllTables();
  $scope.changeTable = function(id){
    console.log($scope.tables);
  }
  $scope.update = function(){
    console.log($scope.tables);
  }
}]);
