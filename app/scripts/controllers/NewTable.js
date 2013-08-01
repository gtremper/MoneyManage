'use strict';

app.controller('NewTableCtrl', ['$rootScope','$scope','Table','$location',function ($rootScope,$scope,Table,$location) {

  $scope.group = {};

  $scope.createTable = function(){
    var emails = $scope.emails || [];
    console.log(emails);
    if (emails.indexOf($rootScope.user.email)<0){
      emails.push($rootScope.user.email);
    }
    console.log(emails);
    Table.newTable($scope.group.title, emails)
  }
}]);
