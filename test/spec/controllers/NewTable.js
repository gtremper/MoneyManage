'use strict';

describe('Controller: NewTableCtrl', function () {

  // load the controller's module
  beforeEach(module('MoneyManageApp'));

  var NewTableCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NewTableCtrl = $controller('NewTableCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
