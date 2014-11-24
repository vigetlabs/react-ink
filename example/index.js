var React = require('react');
var Ink   = require('../dist/ink');

var Component = React.createClass({

  render() {
    return (
      <div>
        <h1>Click anywhere!</h1>
        <Ink color="red"/>
      </div>
    );
  }

});

React.render(<Component />, document.body);
