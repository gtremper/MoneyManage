'use strict';

app.controller('HomeCtrl', ['$rootScope','$scope','Table',function ($rootScope,$scope,Table) {
  Table.getTable().then(function(table){
    $scope.table = table;
    console.log("REAL TABLE");
    console.log($scope.table);
  });
}]);
