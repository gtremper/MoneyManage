'use strict';

describe('Controller: SettleCtrl', function () {

  // load the controller's module
  beforeEach(module('MoneyManageApp'));

  var SettleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SettleCtrl = $controller('SettleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
