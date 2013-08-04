'use strict';

app.controller('EditTableCtrl', ['$rootScope','$scope','$routeParams','$location','$http','$timeout','Table',function ($rootScope,$scope,$routeParams,$location,$http,$timeout,Table) {

  Table.getAllTables().then(function(tables){
    var table = tables[$routeParams.id];

    $scope.members = [$rootScope.user.email];
    $scope.members.push.apply($scope.members,table.members);

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
        return $scope.newMemberEmail === mem;
      });
  
      if (alreadyMember){
        error("Member already part of group",3000);
        $scope.newMemberEmail = '';
        return;
      }
  
      $http.post('/api/check_email',{email: $scope.newMemberEmail})
      .then(function(resp){
        $scope.members.push(resp.data.email);
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

    $scope.save = function(){
      Table.editTable($scope.title,$scope.emails,$routeParams.id)
      .then(function(){
        $location.path('/manage');
      });
    };

    $scope.delete = function(){
      if (confirm('Are you sure you want to delete this table?')){
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
