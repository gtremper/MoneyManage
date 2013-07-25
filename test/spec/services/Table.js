'use strict';

describe('Service: Table', function () {

  // load the service's module
  beforeEach(module('MoneyManageApp'));

  // instantiate service
  var Table;
  beforeEach(inject(function (_Table_) {
    Table = _Table_;
  }));

  it('should do something', function () {
    expect(!!Table).toBe(true);
  });

});
