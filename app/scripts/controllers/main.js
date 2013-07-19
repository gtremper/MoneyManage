'use strict';

app.controller('MainCtrl', ['$scope', function ($scope) {
  /* Hardcoded values for test */
  function transaction(owner,split,amount){
    this.owner = owner;
    this.split = split;
    if (this.split.indexOf(owner)===-1){
      this.split.push(owner);
    }
    this.amount = amount;
    this.date = new Date();
  }

  $scope.transactions = [];
  $scope.owners = [{name:'Graham'},{name:'Max'},{name:'Oli'}];
  $scope.ownerNames = _.map($scope.owners,function(own){return own.name;});

  $scope.allOwnersExcept = function(person){
    return _.reject($scope.owners,function(own){return own.name === person.name;});
  };

  $scope.total = function(person){
    var amt = 0;
    angular.forEach($scope.transactions,function(trans){
      if (trans.owner === person.name){
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
      if (trans.owner === person.name){
        items.push(trans);
      }
    });
    return items;
  }

  $scope.average = function(){
    return $scope.allTotal() / $scope.owners.length;
  }

  $scope.getBalance =function(person){
    var due = 0;
    angular.forEach($scope.transactions,function(trans){
      if(trans.split.indexOf(person.name) >= 0){
        due += trans.amount / trans.split.length;
      }
    });
    return $scope.total(person) - due;
  }

  $scope.addItemAll = function(person){
    if(!person.input){
      return;
    }
    $scope.transactions.push(new transaction(person.name, $scope.ownerNames.slice(0), person.input));
    person.input = "";
  }

  $scope.addItem = function(person){
    if(!person.input){
      return;
    }
    $scope.transactions.push(new transaction(person.name, $scope.checkedNames, person.input));
    $scope.checkedNames = $scope.ownerNames.slice(0);
    $scope.close();
  }

  /* Modal stuff */
  $scope.opts = {
    backdropFade: true,
    dialogFade:true
  };

  $scope.checkedNames = $scope.ownerNames.slice(0);
  $scope.toggleCheck = function (owner) {
    var name = owner.name
    if ($scope.checkedNames.indexOf(name) === -1) {
      $scope.checkedNames.push(name);
    } else {
      $scope.checkedNames.splice($scope.checkedNames.indexOf(name), 1);
    }
    console.log($scope.checkedNames)
  };

  $scope.open = function(person){
    $scope.newItemModal = true;
    $scope.currentUser = person;
  }

  $scope.close = function () {
    $scope.newItemModal = false;
  };
}]);
