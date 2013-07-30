'use strict';

app.factory('Table', ['$http','$rootScope','$location','$q','accessLevels',function ($http,$rootScope,$location,$q,accessLevels) {

  function transaction(split,title,description,amount){
    this.split = split; //people spliting transaction(including owner)
    this.title = title;
    this.description = description
    this.amount = amount;
  }

  var tables = {};

  var promise;

  function getTables(callback){
    promise = $http.get('/api/get_tables').success(function(data){
      _.each(_.keys(tables), function(table){
        delete tables[table];
      });
      console.log(data);
      _.each(data,function(table){
        var new_members = {}
        _.each(table.members, function(member){
          new_members[member._id] = {name: member.name, email:member.email};
        });
        table.members = new_members;
        tables[table._id] = table;
      });
      console.log("ALL TABLES");
      console.log(tables);
      typeof callback === 'function' && callback();
    }).error(function(reps){
      console.log("ERROR");
      console.log(reps);
    });
  }


  $rootScope.$watch('user',function(user){
    if (!(user.role & accessLevels.user)) return;
    console.log('WATCH');
    getTables();
  });

  var Table = {};
  Table.newTable = function(name,members){
    $http.post('/api/create_table',{title: name, emails: members})
    .success(function(table){
      $rootScope.user.currentTable = table._id;
      getTables(function(){
        $location.path('/home');
      });
    })
    .error(function(data){
      console.log("ERROR CREATING TABLE");
      console.log(data);
    });
  };

  Table.switchTable = function(id){
    $rootScope.user.currentTable = id;
    $http.post('/api/set_current_table',{table_id: id})
    .success(function(){
      console.log("table change success!");
    })
    .error(function(data){
      console.log("ERROR SETTING CURRENT TABLE");
      console.log(data);
    });
    return tables[id];
  };

  Table.getAllTables = function(){
    return tables;
  }

  Table.addMember = function(email){
    return $http.post('/api/add_member',{'email':email, table_id: $rootScope.user.currentTable})
    .then(function(resp){
      tables[$rootScope.user.currentTable] = resp.data;
    },
    function(resp){
      console.log('ERROR ADDING MEMBER');
      console.log(resp);
    });
  }

  Table.addTransaction = function(split,title,description,amount){
    var trans = new transaction(split,title,description,amount);
    $http.post('/api/add_transaction',{table_id: $rootScope.user.currentTable, transaction: trans})
    .then(function(resp){
      tables[$rootScope.user.currentTable] = resp.data
      return resp.data;
    },
    function(data){
      console.log("ERROR ADDING TRANSACTION");
      console.log(data);
    });
  }

  return Table;
}]);
