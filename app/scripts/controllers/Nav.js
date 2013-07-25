'use strict';

app.controller('NavCtrl', function ($scope) {
  $scope.logout = function(){
    Auth.logout();
  }
});
