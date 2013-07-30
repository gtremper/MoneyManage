'use strict';

app.controller('ManageCtrl', ['$rootScope','$scope','Table',function ($rootScope,$scope,Table) {
  $scope.tables = Table.getAllTables();
  $scope.changeTable = function(id){
    $rootScope.user.currentTable = id;
  }
}]);
