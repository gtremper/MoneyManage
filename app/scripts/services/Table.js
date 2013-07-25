'use strict';

app.factory('Table', ['$http','$rootScope',function ($http,$rootScope) {
  function transaction(owner,split,title,description,amount){
    this.owner = owner; //who made the transaction
    this.split = split; //people spliting transaction(including owner)
    this.title = title;
    this.description = description
    this.amount = amount;
    this.date = new Date();
    this.id = -1;
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

  var myTables = []

  var currentTable = null;

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
