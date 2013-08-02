'use strict';

app.controller('EditTableCtrl', ['$scope','$routeParams','$location','Table',function ($scope,$routeParams,$location,Table) {

  Table.getAllTables().then(function(tables){
    var table = tables[$routeParams.id];

    $scope.old_members = table.members;
    $scope.form = {}
    $scope.form.title = table.title;

    $scope.save = function(){
      Table.editTable($scope.form.title,$scope.form.emails,$routeParams.id)
      .then(function(){
        $location.path('/manage');
      });
    };

    $scope.delete = function(){
      if (confirm('Are you sure you want to delete this table?')){
        console.log("ASDFASDF");
        Table.deleteTable($routeParams.id).then(function(){
          $location.path('/manage');
        },
        function(){
          console.log("Error in controller");
        });
      }
    };

  })

}]);
