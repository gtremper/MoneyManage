'use strict';

app.factory('Auth',['$http','$cookieStore','userRoles',function ($http,$cookieStore,userRoles) {

  var user = {
    username : $cookieStore.username===undefined ? '' : $cookieStore.username;
    role : $cookieStore.role===undefined ? userRoles.public : $cookieStore.role;
  }

  return {
    authorize: function (accessLevel) {
      return accessLevel & role;
    },
    isLoggedIn: function() {
      return user.role===userRoles.user || user.role===userRoles.admin;
    },
    register: function(user_data, success, error) {
      $http.post('/api/register', user_data).success(success).error(success);
    },
    login: function(user_data, success, error) {
      $http.post('/api/login', user_data).success(function(){
        user = user_data;
        success();
      }).error(error);
    },
    logout: function(success,error) {
      $http.post('/api/logout').success(function(){
        user = {
          username = '',
          role = userRoles.public
        };
        success();
      }).error(error);
    }
  };
}]);
