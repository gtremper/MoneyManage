'use strict';

app.controller('MainCtrl', ['$scope', function ($scope) {
  /* Hardcoded values for test */
  function transaction(owner,split,amount){
    this.owner = owner;
    this.split = split;
    this.split.push(owner);
    this.amount = amount;
    this.date = new Date();
  }

  $scope.transactions = [];
  $scope.transactions.push(new transaction('Graham',['Max','Oli'],12.99));
  $scope.transactions.push(new transaction('Max',['Graham','Oli'],3.99));
  $scope.transactions.push(new transaction('Oli',['Graham','Max'],5.99));
  $scope.owners = ['Graham','Max','Oli'];

  $scope.total = function(person){
    var amt = 0;
    angular.forEach($scope.transactions,function(trans){
      if (trans.owner === person){
        amt += trans.amount;
      }
    })
    return amt;
  }

  $scope.allTotal = function(){
    var amt = 0;
    angular.forEach($scope.transactions,function(trans){
      amt += trans.amount;
    })
    return amt;
  }

  $scope.getItems = function(person){
    var items = []
    angular.forEach($scope.transactions,function(trans){
      if (trans.owner === person){
        items.push(trans);
      }
    });
    return items;
  }

  $scope.average = function(){
    return $scope.allTotal() / $scope.owners.length;
  }

  $scope.getBalance =function(person){
    return $scope.total(person) - $scope.average();
  }

  $scope.addItem = function(person){
    if(!person.input){
      return;
    }
    transaction.items.push(person.input);
    person.input = "";
  }

  /* Modal stuff */
  $scope.opts = {
    backdropFade: true,
    dialogFade:true
  };

  $scope.open = function(person){
    $scope.newItemModal = true;
    $scope.currentUser = person;
  }

  $scope.close = function () {
    $scope.newItemModal = false;
  };
}]);
