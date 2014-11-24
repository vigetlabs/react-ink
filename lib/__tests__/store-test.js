jest.dontMock('../store');
jest.dontMock('../equations');

describe('Ink Store', function() {
  var Store = require('../store');

  it ('can be subscribed to', function() {
    var store = Store();
    var callback = jest.genMockFunction();

    store.subscribe(callback);
    store.publicize();

    expect(callback).toBeCalled();
  });

  it ('can be disposed of', function() {
    var store = Store();
    var callback = jest.genMockFunction();

    // Work around cancelAnimationFrame issues
    window.cancelAnimationFrame = jest.genMockFunction();

    store.subscribe(callback);
    store.dispose();
    store.publicize();

    expect(callback).not.toBeCalled();
  });

});
