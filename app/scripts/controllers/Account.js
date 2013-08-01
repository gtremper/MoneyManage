'use strict';

app.controller('AccountCtrl',['$scope','$rootScope','$location','$timeout','Auth',function ($scope,$rootScope,$location,$timeout,Auth) {
  $scope.form = {};
  $scope.form.name = $rootScope.user.name;
  $scope.form.email = $rootScope.user.email;
  $scope.emailerror = false;

  $scope.save = function(){
    Auth.updateAccount($scope.form.name, $scope.form.email)
    .then(function(resp){
      $location.path('#/manage');
    },
    function(resp){
      $scope.form.email = "";
      $scope.emailerror = true;
      $timeout(function(){
         $scope.emailerror = false;
      },3000);
    });
  }

}]);
