import React from 'react'
import ReactDOM from 'react-dom'
import Ink from '../src/index'
import Test from 'react-dom/test-utils'

class Component extends React.Component {
  render() {
    return (
      <div>
        <h1>Click anywhere!</h1>
        <Ink ref="background" />
        <button style={{ position: 'relative' }} onClick={toggle}>
          Toggle Stress Test
          <Ink key="__ink" />
        </button>
      </div>
    )
  }
}

let playing = false
let component = ReactDOM.render(<Component />, document.getElementById('app'))
let delta = Date.now()
let frame = null

function toggle() {
  if (playing) {
    cancelAnimationFrame(frame)
    playing = false
  } else {
    playing = true

    requestAnimationFrame(function click() {
      if (Date.now() - delta > 1000 / 12) {
        delta = Date.now()
        let dom = ReactDOM.findDOMNode(component.refs.background)

        Test.Simulate.mouseDown(dom, {
          button: 0,
          clientX: Math.random() * window.innerWidth,
          clientY: Math.random() * window.innerHeight
        })

        Test.Simulate.mouseUp(dom)
      }
      frame = requestAnimationFrame(click)
    })
  }
}
