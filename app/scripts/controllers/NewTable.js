'use strict';

app.controller('NewTableCtrl', ['$rootScope','$scope','Table','$location','$http','$timeout',function ($rootScope,$scope,Table,$location,$http,$timeout) {

  $scope.members = [_.pick($rootScope.user, 'email', 'name','_id')];

  $scope.timeouts = 0;
  $scope.errorMsg = 'default'

  $scope.removeMember = function(mem){
    $scope.members = _.reject($scope.members, function(m){
      return mem===m;
    });
  }

  function error(msg,time){
    $scope.errorMsg = msg;
    $scope.timeouts++;
    $timeout(function(){
        $scope.timeouts--;
    },time);
    return;
  }


  $scope.addMember = function(){
    if (!$scope.memberEmail.$valid){
      error("Enter a valid email",3000);
      return;
    }

    var alreadyMember = _.find($scope.members, function(mem){
      return $scope.newMemberEmail === mem.email;
    });

    if (alreadyMember){
      error("Member already part of group",3000);
      $scope.newMemberEmail = '';
      return;
    }

    $http.post('/api/check_email',{email: $scope.newMemberEmail})
    .then(function(resp){
      $scope.members.push(resp.data);
      $scope.newMemberEmail = '';
    },
    function(resp){
      console.log(resp)
      if (resp.status === 400){
        if (!$scope.newMemberEmail){
          error("Enter a valid email",3000);
          $scope.newMemberEmail = '';
        } else {
          error("No users with that email",3000);
        }
      } else {
        console.log("database error");
      }
    });
  }

  $scope.createTable = function(){
    var members = _.pluck($scope.members, '_id');
    Table.newTable($scope.title, members);
  }
}]);
