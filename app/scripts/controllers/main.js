'use strict';

app.controller('MainCtrl', ['$scope', function ($scope) {
    var people = []
    people.push({name:'Graham', items:[1.99,4.33]});
    people.push({name:'Becca', items:[2.33,1.99,4.33]});
    people.push({name:'Oliver', items:[1.11,4.33]});
    people.push({name:'Max', items:[1.99,4.33, 234.34]});
    people.push({name:'Jon', items:[1.99]});

    $scope.people = people;

    $scope.total = function(person){
      var amt = 0;
      angular.forEach(person.items,function(item){
        amt += item;
      })
      return amt;
    }

    $scope.addItem = function(person){
      person.items.push(person.input);
    }
  }]);
