'use strict';

app.factory('Auth',['$rootScope','$http','$cookieStore','$location','userRoles','accessLevels',function ($rootScope,$http,$cookieStore,$location,userRoles,accessLevels) {

  $rootScope.user = $cookieStore.get('user') || {username: '', role: userRoles.public};
  $cookieStore.remove('user');

  $rootScope.accessLevels = accessLevels;
  $rootScope.userRoles = userRoles;

  return {
    authorize: function (accessLevel, role) {
      if (role===undefined){
        role = $rootScope.user.role;
      }
      return accessLevel & role;
    },
    isLoggedIn: function(user) {
      if (user===undefined){
        user = $rootScope.user;
      }
      return user.role===userRoles.user || user.role===userRoles.admin;
    },
    register: function(user, success, error) {
      $http.post('/register', user).success(success).error(success);
    },
    login: function(user, success, error) {
      $http.post('/login', user).success(function(user){
        $rootScope.user = user;
        success(user);
      }).error(error);
    },
    logout: function(success,error) {
      $http.post('/logout').success(function(){
        $rootScope.user = {
          username :'',
          role : userRoles.public
        };
        if (success===undefined){
          $location.path('/signin');
        } else {
          success();
        }
      }).error(error);
    },
    accessLevels: accessLevels,
    userRoles: userRoles
  };
}]);
