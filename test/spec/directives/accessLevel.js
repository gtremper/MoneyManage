'use strict';

describe('Directive: accessLevel', function () {
  beforeEach(module('MoneyManageApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<access-level></access-level>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the accessLevel directive');
  }));
});
