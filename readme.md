# React Ink

[![Build Status](https://travis-ci.org/vigetlabs/washi.png?branch=master)](https://travis-ci.org/vigetlabs/washi)

Add ink to any react component.

## Usage

Include `./ink.css` within your stylesheet build process. Then you can include the `<Ink />` component like so:

```js
var React = require('react');
var Ink = require('react-ink');

module.exports = React.createClass({
  render() {
    return (
      <div>
        <Ink />
      </div>
    );
  }
});
```
