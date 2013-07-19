'use strict';

describe('Controller: ViewTransCtrl', function () {

  // load the controller's module
  beforeEach(module('MoneyManageApp'));

  var ViewTransCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewTransCtrl = $controller('ViewTransCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
