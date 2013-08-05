'use strict';

app.factory('Table', ['$http','$rootScope','$location','$q','accessLevels','Auth',function ($http,$rootScope,$location,$q,accessLevels,Auth) {

  function transaction(split,title,description,amount){
    this.split = split; //people spliting transaction(including owner)
    this.title = title;
    this.description = description
    this.amount = amount;
  }

  var tables = {};
  var promise = $q.defer();

  function getTables(callback){
    console.log("GET TABLES");
    promise = $q.defer();
    $http.get('/api/get_tables').success(function(data){
      console.log("got tables..");
      _.each(_.keys(tables), function(table){
        delete tables[table];
      });
      _.each(data,function(table){
        var new_members = {}
        _.each(table.members, function(member){
          if(member._id !== $rootScope.user._id){
            new_members[member._id] = {name: member.name, email: member.email, _id:member._id};
          }
        });
        table.members = new_members;
        tables[table._id] = table;
      });
      promise.resolve();
      typeof callback === 'function' && callback();
    }).error(function(reps){
      console.log("ERROR");
      console.log(reps);
    });
  }


  $rootScope.$watch('user',function(user){
    if (!(user.role & accessLevels.user)) return;
    getTables();
  });

  var Table = {};
  Table.newTable = function(name,members){
    $http.post('/api/create_table',{title: name, ids: members})
    .success(function(table){
      $rootScope.user.currentTable = table._id;
      $http.post('/api/set_current_table',{table_id: table._id}).success(function(){
        console.log("set current table")
        getTables(function(){
          $location.path('/manage');
        });
      });
    })
    .error(function(data){
      console.log("ERROR CREATING TABLE");
      console.log(data);
    });
  };

  Table.getTable = function(){
    return promise.promise.then(function(){
      var curTable = $rootScope.user.currentTable;
      var tbl_id;
      if(curTable && _.contains(_.keys(tables), curTable)){
        tbl_id = curTable;
      } else if (!_.isEmpty(tables)){
        tbl_id = _.keys(tables)[0];
        $rootScope.user.currentTable = tbl_id;
      } else {
        $location.path('/manage');
        return;
      }

      $http.post('/api/set_current_table',{table_id: tbl_id})
      .success(function(){
        console.log("table change success!");
      })
      .error(function(data){
        console.log("ERROR SETTING CURRENT TABLE");
        console.log(data);
      });

      return tables[tbl_id];

    });
  }

  Table.getAllTables = function(){
    return promise.promise.then(function(){
      return tables;
    });
  }

  Table.editTable = function(title,members,id){
    var body = {
      title: title,
      member_ids: members,
      table_id: id
    }
    console.log("Pre edit");
    return $http.post('/api/edit_table',body)
    .then(function(resp){
      //tables[id] = resp.data;
      console.log("Edit success");
      getTables(function(){
        $location.path('/manage');
      });
      return resp.data;
    },
    function(resp){
      console.log('ERROR ADDING MEMBER');
      console.log(resp);
    });
  }

  Table.deleteTable = function(id){
    return $http.post('/api/delete_table',{table_id: id})
    .then(function(resp){
      delete tables[id];
      $rootScope.user.tables = _.reject($rootScope.user.tables,function(table){
        return table === id;
      });
    },
    function(resp){
      console.log('ERROR ADDING MEMBER');
      console.log(resp);
    });
  }

  Table.addTransaction = function(split,title,description,amount){
    var trans = new transaction(split,title,description,amount);
    return $http.post('/api/add_transaction',{table_id: $rootScope.user.currentTable, transaction: trans})
    .then(function(resp){
      tables[$rootScope.user.currentTable].transactions = resp.data;
      return resp.data;
    },
    function(data){
      console.log("ERROR ADDING TRANSACTION");
      console.log(data);
    });
  }

  Table.editTransaction = function(trans){
    return $http.post('/api/edit_transaction',{table_id: $rootScope.user.currentTable, transaction: trans})
    .then(function(resp){
      tables[$rootScope.user.currentTable].transactions = resp.data;
      return resp.data;
    },
    function(data){
      console.log("ERROR ADDING TRANSACTION");
      console.log(data);
    });
  }

  Table.deleteTransaction = function(id){
    return $http.post('/api/delete_transaction',{table_id: $rootScope.user.currentTable, trans_id: id})
    .then(function(resp){
      tables[$rootScope.user.currentTable].transactions = resp.data;
      return resp.data;
    },
    function(data){
      console.log("ERROR ADDING TRANSACTION");
      console.log(data);
    });
  }

  return Table;
}]);
