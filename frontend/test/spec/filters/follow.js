'use strict';

describe('Filter: follow', function () {

  // load the filter's module
  beforeEach(module('frontendApp'));

  // initialize a new instance of the filter before each test
  var follow;
  beforeEach(inject(function ($filter) {
    follow = $filter('follow');
  }));

  it('should return the input prefixed with "follow filter:"', function () {
    var text = 'angularjs';
    expect(follow(text)).toBe('follow filter: ' + text);
  });

});
