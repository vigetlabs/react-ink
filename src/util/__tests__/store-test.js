jest.dontMock('../store')
jest.dontMock('../equations')

describe('Ink Store', function() {
  var Store = require('../store')

  window.cancelAnimationFrame = jest.genMockFunction()

  it ('can be subscribed to', function() {
    var callback = jest.genMockFunction()
    var store    = Store(callback)

    store.update()

    expect(callback).toBeCalled()
  })

})
