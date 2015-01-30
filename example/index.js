var React = require('react');
var Ink   = require('../src');

var Component = React.createClass({

  render() {
    return (
      <div>
        <h1>Click anywhere!</h1>
        <Ink color="red"/>
        <button style={{ position: 'relative' }} onClick={ this._onClick }>
          Buttons Too!
          <Ink key="__ink" />
        </button>
      </div>
    );
  },

  _onClick() {
    console.log('success')
  }

});

React.render(<Component />, document.body);
