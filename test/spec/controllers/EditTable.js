'use strict';

describe('Controller: EditTableCtrl', function () {

  // load the controller's module
  beforeEach(module('MoneyManageApp'));

  var EditTableCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditTableCtrl = $controller('EditTableCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
