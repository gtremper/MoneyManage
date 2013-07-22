'use strict';

var app = angular.module('MoneyManageApp', ['ui','ui.bootstrap','ngCookies']);

/* Authentication constants */
!function(app){
  var userRoles = {
    public: 1, // 001
    user:   2, // 010
    admin:  4  // 100
  };

  app.constant('userRoles',userRoles);

  app.constant('accessLevels',{
    public: userRoles.public | userRoles.user | userRoles.admin, // 111
    anon:   userRoles.public,                                    // 001
    user:   userRoles.user | userRoles.admin,                    // 110
    admin:  userRoles.admin                                      // 100
  });
}(app);

app.config(['$routeProvider','$locationProvider','userRoles','accessLevels', function ($routeProvider,$locationProvider,userRoles,accessLevels) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/signin',{
      templateUrl: 'views/signin.html',
      controller: 'SigninCtrl',
      access: accessLevels.public
    })
    .otherwise({
      redirectTo: '/signin'
    });
  //$locationProvider.html5Mode(true);
}]);
