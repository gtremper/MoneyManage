'use strict';

app.controller('HomeCtrl', ['$rootScope','$scope','Table',function ($rootScope,$scope,Table) {
  Table.getTable().then(function(table){

    $scope.table = table;
    $scope.tab = '';
    $scope.anim_dir = '';
  
    $scope.viewTrans = function(trans){
      $scope.currentTrans = trans;
      $scope.changeTab('view','view-left');
      console.log(trans);
    }
  
    $scope.total = function(person){
      var amt = 0;
      angular.forEach($scope.table.transactions,function(trans){
        if (trans.owner._id === person._id){
          amt += trans.amount;
        }
      })
      return amt;
    }
  
    $scope.allTotal = function(){
      var amt = 0;
      angular.forEach($scope.table.transactions,function(trans){
        amt += trans.amount;
      })
      return amt;
    }
  
    $scope.getItems = function(person){
      var items = []
      angular.forEach($scope.table.transactions,function(trans){
        if (trans.owner._id === person._id){
          items.push(trans);
        }
      });
      return items;
    }
  
    $scope.getBalance =function(person){
      var due = 0;
      angular.forEach($scope.table.transactions,function(trans){
        if(trans.split.indexOf(person._id) >= 0){
          due += trans.amount / trans.split.length;
        }
      });
      return $scope.total(person) - due;
    }
  
    /* View Stuff */
  
    $scope.editSplit = function(name,split){
      if (split.indexOf(name) === -1) {
        split.push(name);
      } else {
        split.splice(split.indexOf(name), 1);
      }
      console.log(split)
    }
  
    $scope.deleteTransaction = function(trans){
      $scope.transactions.splice($scope.transactions.indexOf(trans), 1);
  
    }
  
  
    /* Add stuff */
  
    $scope.addItem = function(person){
      if(!person.inputAmount){
        return;
      }
      $scope.transactions.push(new transaction(person.name, $scope.checkedNames, person.inputTitle,
                                              person.inputDescription, person.inputAmount));
      $scope.checkedNames = $scope.ownerNames.slice(0);
      person.inputAmount = "";
      person.inputDescription = "";
      person.inputTitle = "";
    }
  
    $scope.changeTab = function(change,anim){
      if (anim !== undefined){
        $scope.anim_dir = anim;
      }
      $scope.tab = change;
    }
  
    $scope.toggleCheck = function (person) {
      var name = person.name
      if ($scope.checkedNames.indexOf(name) === -1) {
        $scope.checkedNames.push(name);
      } else {
        $scope.checkedNames.splice($scope.checkedNames.indexOf(name), 1);
      }
      console.log($scope.checkedNames)
    };
  });


}]);

