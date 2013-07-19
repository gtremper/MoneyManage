'use strict';

var app = angular.module('MoneyManageApp', ['ui','ui.bootstrap']);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/signin',{
      templateUrl: 'views/signin.html',
      controller: 'SigninCtrl'
    })
    .otherwise({
      redirectTo: '/signin'
    });
}]);
