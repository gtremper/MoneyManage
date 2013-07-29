'use strict';

app.factory('Table', ['$http','$rootScope','$location','$q',function ($http,$rootScope,$location,$q) {
  function transaction(split,title,description,amount){
    this.split = split; //people spliting transaction(including owner)
    this.title = title;
    this.description = description
    this.amount = amount;
  }

  var myTables = {};
  var currentTable = null;
  var

  function getTables(callback){
    $http.get('/api/get_tables').success(function(data){
      for(var i=0, len = data.length; i<len; i++){
        myTables[data[i]._id] = data[i];
      }
      currentTable = myTables[$rootScope.user.currentTable];
      if (callback!===undefined) callback();
    });
  }

  $rootScope.$watch('user',function(user){
    if (user.role & $rootScope.accessLevels.user){
      getTables();
    }
  });


  return {
    newTable: function (name,members) {
      $http.post('/api/create_table',{title: name, emails: members})
      .success(function(table){
        myTables[table._id] = table;
        currentTable = table;
        $rootScope.user.currentTable = table._id;
        $location.path('/home');
      })
      .error(function(data){
        console.log("ERROR CREATING TABLE");
        console.log(data);
      });
    },
    changeTable: function(table_id){
      currentTable = myTables[table_id];
      $rootScope.user.currentTable = table._id;
    },
    addMember: function(email){
      $http.post('/api/add_member',{'email':email, table_id: currentTable._id})
      .success(function(data){
        currentTable = myTables[currentTable._id] = data;
      })
      .error(function(data){
        console.log("ERROR ADDING MEMBER");
        console.log(data);
      });
    },
    getTableNames: function(){
      return _.map(myTables,function(table){
        return {name:table.title, _id: table._id};
      });
    },
    getTableMembers: function(){
      $http.get('/api/get_member_names',currentTable.members)
      .success(function(data){
        return data;
      })
      .error(function(data){
        console.log("ERROR Gettings MEMBERs");
        console.log(data);
      });
    },
    addTransaction: function(split,title,description,amount){
      var trans = new transaction(split,title,description,amount);
      $http.post('/api/add_transaction',{table_id: currentTable._id, transaction: trans})
      .success(function(data){
        currentTable = myTables[currentTable._id] = data;
      })
      .error(function(data){
        console.log("ERROR ADDING TRANSACTION");
        console.log(data);
      });
    }
  };
}]);
