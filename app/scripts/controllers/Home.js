'use strict';

app.controller('HomeCtrl', ['$rootScope','$scope','Table',function ($rootScope,$scope,Table) {

  $scope.table = {
    title: "Loading...",
    members: {},
    transactions: []
  }
  Table.getTable().then(function(table){
    $scope.table = table;
    console.log(table);

    /* Add stuff */
    !function(){
      $scope.new = {};
      var checkboxes = _.keys($scope.table.members);
      checkboxes.push($rootScope.user._id);
      var allSelected = checkboxes.slice(0);//copy
  
      $scope.toggleCheck = function(member){
        var id = member._id;
        var index = checkboxes.indexOf(id);
        if (index === -1){
          checkboxes.push(id);
        } else {
          checkboxes.splice(index,1);
        }
      }
  
      $scope.addItem = function(){
        console.log("Add Item");
        var title = $scope.new.title;
        var description = $scope.new.description;
        var amount = $scope.new.amount;
        if (!title || !amount){
          return;
        }
        Table.addTransaction(checkboxes,title,description,amount)
        .then(function(data){
          $scope.changeTab('home','view-left');
          $scope.new.title = "";
          $scope.new.description = "";
          $scope.new.amount = 0;
          checkboxes = allSelected.slice(0);
        },
        function(data){
          console.log("transaction eerrro");
        });
      }
    }();
  });

  $scope.tab = '';
  $scope.anim_dir = '';
  
  $scope.viewTrans = function(trans){
    $scope.currentTrans = trans;
    $scope.changeTab('view','view-left');
    console.log(trans);
  }
  
  $scope.personalTotal = function(person){
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
    return $scope.personalTotal(person) - due;
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

  /** Animations **/
  $scope.changeTab = function(change,anim){
    if (anim !== undefined){
      $scope.anim_dir = anim;
    }
    $scope.tab = change;
  }


}]);

