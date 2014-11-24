jest.dontMock('../atLeast');

describe('AtLeast Type', function() {

  var AtLeast = require('../atLeast');

  it ('throws a TypeError if the value is not a number', function() {
    var report = AtLeast(0, 1)({ val: '1' }, 'val', 'Foo');
    expect(report instanceof Error).toBeTruthy();
  });

  it ('throws a RangeError if the value is not within the given threshold', function() {
    var report = AtLeast(0)({ val: -2 }, 'val', 'Foo');
    expect(report instanceof RangeError).toBeTruthy();
  });

  it ('allows accepted values', function() {
    expect(AtLeast(0)({ val: 0.5 }, 'val', 'Foo')).toBeUndefined();
  });

  it ('is not required', function() {
    expect(AtLeast(0)({  }, 'val', 'Foo')).toBeUndefined();
  });

});
