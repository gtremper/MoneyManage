'use strict';

app.controller('AccountCtrl',['$scope','$rootScope','$location','Auth',function ($scope,$rootScope,$location,Auth) {
  $scope.form = {};
  $scope.form.name = $rootScope.user.name;
  $scope.form.email = $rootScope.user.email;

  $scope.save = function(){
    Auth.updateAccount($scope.form.name, $scope.form.email)
    .then(function(){
      $location.path('#/manage');
    })
  }

}]);
