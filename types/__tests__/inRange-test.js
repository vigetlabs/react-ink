jest.dontMock('../inRange');

describe('InRange Type', function() {

  var InRange = require('../inRange');

  it ('does not allow the lower threshold to be higher than the upper threshold', function() {
    var error;

    try {
      InRange(1, 0);
    } catch(x) {
      error = x;
    }

    expect(error instanceof Error).toBeTruthy();
  });

  it ('throws a TypeError if the value is not a number', function() {
    var report = InRange(0, 1)({ val: '1' }, 'val', 'Foo');
    expect(report instanceof Error).toBeTruthy();
  });

  it ('throws a RangeError if the value is not within the given threshold', function() {
    var report = InRange(0, 1)({ val: 2 }, 'val', 'Foo');
    expect(report instanceof RangeError).toBeTruthy();
  });

  it ('allows accepted values', function() {
    expect(InRange(0, 1)({ val: 0.5 }, 'val', 'Foo')).toBeUndefined();
  });

  it ('is not required', function() {
    expect(InRange(0, 1)({  }, 'val', 'Foo')).toBeUndefined();
  });

});
