'use strict';

app.controller('SigninCtrl', ['$scope','$location','$http','Auth',function ($scope,$location,$http,Auth) {

  $scope.login = function(){
    Auth.login({
      email: $scope.email,
      password: $scope.password,
      rememberme: $scope.rememberme
    },
    function(res){
      $location.path('/');
    },
    function(data,status){
      console.log(data);
      console.log(status);
    });
  };

  $scope.addTable = function(){
    $http.post('/api/create_table',{emails:['derp'], title:'Derp Table'})
    .success(function(data){
      console.log("success!");
      console.log(data);
    })
    .error(function(data,status){
      console.log('error');
      console.log(data);
    });
  }

  $scope.getTables = function(){
    $http.get('/api/get_tables')
    .success(function(data){
      console.log("success!");
      console.log(data);
    })
    .error(function(data,status){
      console.log('error');
      console.log(data);
    });
  }

  $scope.addMember = function(){
    $http.post('/api/add_member',{table_id: "51f5b25a89cec30000000002",email: 'graham'})
    .success(function(data){
      console.log("success!");
      console.log(data);
    })
    .error(function(data,status){
      console.log('error');
      console.log(data);
    });
  }

  $scope.addTransaction = function(){
    $http.post('/api/add_transaction',{table_id: "51f5b25a89cec30000000002"})
    .success(function(data){
      console.log("success!");
      console.log(data);
    })
    .error(function(data,status){
      console.log('error');
      console.log(data);
    });
  }
}]);
