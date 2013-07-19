'use strict';

app.controller('MainCtrl', ['$scope', function ($scope) {
    var people = []
    people.push({name:'Graham', items:[1.99,4.33]});
    people.push({name:'Becca', items:[2.33,1.99,4.33]});
    people.push({name:'Oliver', items:[1.11,4.33]});
    people.push({name:'Max', items:[1.99,4.33, 23.34]});
    people.push({name:'Jon', items:[1.99]});
    $scope.people = people;

    $scope.opts = {
      backdropFade: true,
      dialogFade:true
    };

    $scope.total = function(person){
      var amt = 0;
      angular.forEach(person.items,function(item){
        amt += item;
      })
      return amt;
    }

    $scope.allTotal = function(){
      var amt = 0;
      angular.forEach(people,function(person){
        amt += $scope.total(person);
      })
      return amt;
    }

    $scope.average = function(){
      return $scope.allTotal() / people.length;
    }

    $scope.getBalance =function(person){
      return $scope.total(person) - $scope.average();
    }

    $scope.addItem = function(person){
      if(!person.input){
        return;
      }
      person.items.push(person.input);
      person.input = "";
    }

    $scope.open = function(person){
      $scope.newItemModal = true;
      $scope.currentUser = person;
    }

    $scope.close = function () {
      $scope.newItemModal = false;
    };
  }]);
