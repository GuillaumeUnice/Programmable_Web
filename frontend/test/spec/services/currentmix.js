'use strict';

describe('Service: currentMix', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var currentMix;
  beforeEach(inject(function (_currentMix_) {
    currentMix = _currentMix_;
  }));

  it('should do something', function () {
    expect(!!currentMix).toBe(true);
  });

});
