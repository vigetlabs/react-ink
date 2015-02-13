import React from 'react/addons'
import Ink   from '../src/index'

let Test = React.addons.TestUtils

let Component = React.createClass({

  render() {
    return (
      <div>
        <h1>Click anywhere!</h1>
        <Ink ref="background" style={{ color: 'red' }} />
        <button style={{ position: 'relative' }} onClick={ this._onClick }>
          Buttons Too!
          <Ink key="__ink" />
        </button>
      </div>
    )
  },

  _onClick() {
    console.log('success')
  }

})

let component = React.render(<Component />, document.body)
let delta = Date.now()

requestAnimationFrame(function click() {
  if (Date.now() - delta > 100) {
    delta = Date.now()
    let dom = component.refs.background.getDOMNode()

    Test.Simulate.mouseDown(dom, {
      button: 0,
      clientX: Math.random() * window.innerWidth,
      clientY: Math.random() * window.innerHeight
    })

    Test.Simulate.mouseUp(dom)
  }
  requestAnimationFrame(click)
})
