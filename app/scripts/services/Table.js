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
    $http.post('/api/create_table',{title: name, emails: members})
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
      var tbl_id;
      if ($rootScope.user.currentTable){
        tbl_id = $rootScope.user.currentTable;
      } else {
        console.log('default get table');
        tbl_id = _.keys(tables)[0];
        $rootScope.user.currentTable = tbl_id;
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
