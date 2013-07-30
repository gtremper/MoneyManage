'use strict';

app.factory('Table', ['$http','$rootScope','$location','$q','accessLevels',function ($http,$rootScope,$location,$q,accessLevels) {

  function transaction(split,title,description,amount){
    this.split = split; //people spliting transaction(including owner)
    this.title = title;
    this.description = description
    this.amount = amount;
  }

  var tables = {};

  function getTables(callback){
    console.log("GET TABLES");
    return $http.get('/api/get_tables').success(function(data){
      console.log("got tables..");
      console.log(data);
      _.each(_.keys(tables), function(table){
        delete tables[table];
      });
      _.each(data,function(table){
        var new_members = {}
        _.each(table.members, function(member){
          new_members[member._id] = {name: member.name, email:member.email};
        });
        table.members = new_members;
        tables[table._id] = table;
      });
      typeof callback === 'function' && callback();
    }).error(function(reps){
      console.log("ERROR");
      console.log(reps);
    });
  }

var promise = getTables();

  $rootScope.$watch('user',function(user){
    if (!(user.role & accessLevels.user)) return;
    promise = getTables();
  });

  var Table = {};
  Table.newTable = function(name,members){
    $http.post('/api/create_table',{title: name, emails: members})
    .success(function(table){
      $rootScope.user.currentTable = table._id;
      $http.post('/api/set_current_table',{table_id: table._id}).success(function(){
        console.log("set current table")
      });
      getTables(function(){
        $location.path('/manage');
      });
    })
    .error(function(data){
      console.log("ERROR CREATING TABLE");
      console.log(data);
    });
  };

  Table.getTable = function(){
    return promise.then(function(){
      if ($rootScope.user.currentTable){
        return tables[$rootScope.user.currentTable];
      } else {
        console.log('default get table');
        var id = _.keys(tables)[0];
        $rootScope.user.currentTable = id;
        return tables[id];
      }
    });
  }

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

  Table.addMember = function(email,id){
    return $http.post('/api/add_member',{'email':email, table_id: id})
    .then(function(resp){
      tables[id] = resp.data;
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
