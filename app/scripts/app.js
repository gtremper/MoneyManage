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

app.config(['$routeProvider','$locationProvider','$httpProvider','accessLevels', function ($routeProvider,$locationProvider,$httpProvider,accessLevels) {
  $routeProvider
    /*
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      access: accessLevels.user
    })
    */
    .when('/signin',{
      templateUrl: 'views/signin.html',
      controller: 'SigninCtrl',
      access: accessLevels.public
    })
    .when('/register',{
      templateUrl: 'views/register.html',
      controller: 'RegisterCtrl',
      access: accessLevels.public
    })
    .when('/home',{
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl',
      access: accessLevels.user
    })
    .when('/manage',{
      templateUrl: 'views/manage_tables.html',
      controller: 'ManageCtrl',
      access: accessLevels.user
    })
    .when('/new_table',{
      templateUrl: 'views/new_table.html',
      controller: 'NewTableCtrl',
      access: accessLevels.user
    })
    .when('/edit_table/:id',{
      templateUrl: 'views/edit_table.html',
      //
      controller: 'EditTableCtrl',
      access: accessLevels.user
    })
    .when('/account',{
      templateUrl: 'views/account.html',
      controller: 'AccountCtrl',
      access: accessLevels.user
    })
    .otherwise({
      redirectTo: '/manage'
    });


  $httpProvider.responseInterceptors.push(['$location','$q',function($location,$q){
    function success(response){
      return response;
    };
    function error(response){
      if(response.status === 401){
        $location.path('#/signin');
        return $q.reject(response);
      } else {
        return $q.reject(response);
      }
    }
    return function(promise){
      return promise.then(success,error);
    };
  }]);

}]);


app.run(['$rootScope','$location','Auth',function($rootScope,$location,Auth){
  $rootScope.$on('$routeChangeStart', function(event, next, current){
    if (!Auth.authorize(next.access)){
      $location.path('#/signin');
    }
  });
}]);




