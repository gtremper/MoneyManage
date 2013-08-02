'use strict';

app.controller('SettleCtrl', ['$rootScope','$scope','$routeParams','Table',function ($rootScope,$scope,$routeParams,Table) {
  Table.getTable($routeParams.id).then(function(table){
    $scope.table = table;

    var getBalance =function(person){
      var due = 0;
      var paid = 0;
      angular.forEach($scope.table.transactions,function(trans){
        if(trans.split.indexOf(person._id) >= 0){
          due += trans.amount / trans.split.length;
        }
        if (trans.owner === person._id){
          paid += trans.amount;
        }
      });
      return paid - due;
    }

    $scope.get = [];
    $scope.give = [];

    $scope.abs = function(num){
      if(num<0){
        num = -num;
      }
      return num;
    }

    $scope.myBalance = getBalance($rootScope.user);

    angular.forEach($scope.table.members, function(member){
      var balance = getBalance(member);
      if (balance<0){
        $scope.get.push({name:member.name, amount: -balance});
      }
      if (balance>0){
        $scope.give.push({name:member.name, amount: balance});
      }
    });

  })
}]);
