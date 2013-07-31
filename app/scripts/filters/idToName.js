'use strict';

app.filter('idToName', ['$rootScope',function ($rootScope,Table) {
  return function (id,table) {
    var name = table.members[id]
    if (typeof name === 'undefined'){
      name = $rootScope.user;
    }
    return name.name;
  };
}]);
