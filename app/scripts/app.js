'use strict';

var app = angular.module('MoneyManageApp', ['ui','ui.bootstrap']);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/view/', {
      templateUrl: 'views/viewTransaction.html',
      controller: 'ViewTransCtrl'
    })
    .when('/add/', {
      templateUrl: 'views/addTransaction.html',
      controller: 'AddTransCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
