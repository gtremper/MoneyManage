'use strict';

app.controller('MainCtrl', ['$rootScope','$cookieStore','$scope','$http','Auth', function ($rootScope,$cookieStore,$scope,$http,Auth) {
  /* Hardcoded values for test */
  function transaction(owner,split,title,description,amount){
    this.owner = owner;
    this.split = split;
    this.title = title;
    this.description = description
    this.amount = amount;
    this.date = new Date();
  }

  $scope.transactions = [];
  $scope.owners = [{name:'Graham'},{name:'Max'},{name:'Oli'}];
  $scope.ownerNames = _.map($scope.owners,function(own){return own.name;});
  $scope.tableName = "Table 1"

  $scope.tab = '';
  $scope.anim_dir = '';

  $scope.setCurrentUser = function(user){
    $scope.currentUser = user;
  }

  $scope.viewTrans = function(trans){
    $scope.currentTrans = trans;
    $scope.changeTab('view','view-left');
    console.log(trans);
  }

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

  $scope.checkedNames = $scope.ownerNames.slice(0);
  $scope.toggleCheck = function (person) {
    var name = person.name
    if ($scope.checkedNames.indexOf(name) === -1) {
      $scope.checkedNames.push(name);
    } else {
      $scope.checkedNames.splice($scope.checkedNames.indexOf(name), 1);
    }
    console.log($scope.checkedNames)
  };


  /*****  Auth ******/

  $scope.logout = function(){
    Auth.logout();
  }

  $scope.print = function(){
    console.log('print');
    $http.get('/api/test').success(function(data){
      console.log('success');
      console.log(data);
    }).error(function(err){
      console.log('error');
      console.log(err)
    });
  }

}]);
