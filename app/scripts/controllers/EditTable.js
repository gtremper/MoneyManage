'use strict';

app.controller('EditTableCtrl', ['$scope','$routeParams','Table',function ($scope,$routeParams,Table) {

  Table.getAllTables().then(function(tables){
    var table = tables[$routeParams.id];

    $scope.old_members = table.members;
    $scope.form = {}
    $scope.form.title = table.title;

    $scope.save = function(){
      Table.editTable($scope.form.title,$scope.form.emails,$routeParams.id);
    }
  })

}]);
