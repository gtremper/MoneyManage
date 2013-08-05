'use strict';

app.controller('EditTableCtrl', ['$rootScope','$scope','$routeParams','$location','$http','$timeout','Table',function ($rootScope,$scope,$routeParams,$location,$http,$timeout,Table) {

  Table.getAllTables().then(function(tables){
    var table = tables[$routeParams.id];

    $scope.title = table.title;
    $scope.members = [_.pick($rootScope.user,'email','name','_id')];
    $scope.members.push.apply($scope.members,_.values(table.members));
    console.log($scope.members);
    console.log(table.members);

    $scope.timeouts = 0;
    $scope.errorMsg = 'default'
  
    function error(msg,time){
      $scope.errorMsg = msg;
      $scope.timeouts++;
      $timeout(function(){
          $scope.timeouts--;
      },time);
      return;
    }

    $scope.removeMember = function(mem){

      var dirty = false;
      var user_id = mem._id;
      _.each(table.transactions, function(trans){
        if (trans.owner===user_id || _.contains(trans.split,user_id)){
          console.log(trans);
          dirty = true;
        }
      });

      if (dirty){
        error("Can't remove user involved in a payment",3000);
        return;
      }


      $scope.members = _.reject($scope.members, function(m){
        return mem===m;
      });
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

    $scope.save = function(){
      var ids = _.pluck($scope.members,'_id');
      Table.editTable($scope.title, ids, $routeParams.id);
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
