'use strict';

app.controller('NewTableCtrl', ['$rootScope','$scope','Table','$location',function ($rootScope,$scope,Table,$location) {
  $scope.createTable = function(){
    var emails = $scope.emails;
    if (emails && emails.indexOf($rootScope.user.email)<0){
      emails.push($rootScope.user.email);
    }
    console.log(emails)
    Table.newTable($scope.title, $scope.emails)
  }
}]);
