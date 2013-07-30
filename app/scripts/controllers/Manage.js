'use strict';

app.controller('ManageCtrl', ['$scope','Table',function ($scope,Table) {

  $scope.test = Table.getValue();
}]);
