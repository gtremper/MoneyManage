'use strict';

describe('Controller: AddTransCtrl', function () {

  // load the controller's module
  beforeEach(module('MoneyManageApp'));

  var AddTransCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddTransCtrl = $controller('AddTransCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
