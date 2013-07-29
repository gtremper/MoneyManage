'use strict';

app.factory('Table', ['$http','$rootScope',function ($http,$rootScope) {
  function transaction(owner,split,title,description,amount){
    this.owner = owner; //who made the transaction
    this.split = split; //people spliting transaction(including owner)
    this.title = title;
    this.description = description
    this.amount = amount;
  }

  function member(name,email){
    this.name = name;
    this.email = email;
    this.id = -1;
  }

  function table(name){
    this.name;
    this.transactions;
    this.members;
    this.id;
  }

  var myTables = {};
  $http.get('/api/get_tables').success(function(data){
    console.log("Get Tables");
    console.log(data);
    for(var i=0, len = data.length; i<len; i++){
      myTables[data[i]._id] = data[i];
    }
  });

  var currentTable = myTables[$rootScope.user.currentTable];

  return {
    newTable: function (name) {
      
    },
    addTransaction: function (trans){

    },
    editTransaction: function(trans){

    },
    addMember: function(email){

    }
  };
}]);
