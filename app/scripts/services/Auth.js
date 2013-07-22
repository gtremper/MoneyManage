'use strict';

app.factory('Auth',['$rootScope','$http','$cookieStore','userRoles','accessLevels',function ($http,$cookieStore,userRoles) {

  $rootScope.user = $cookieStore.get('user') || {username: '', role: userRoles.public};
  $cookieStore.remove('user')

  $rootScope.accessLevels = accessLevels;
  $rootScope.userRoles = userRoles;

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
          username :'',
          role : userRoles.public
        };
        success();
      }).error(error);
    },
    accessLevels: accessLevels,
    userRoles: userRoles
  };
}]);
