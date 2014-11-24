# React Ink

[![Build Status](https://travis-ci.org/vigetlabs/washi.png?branch=master)](https://travis-ci.org/vigetlabs/washi)

Add ink to any react component.

![Ink Gif](http://cl.ly/image/0M071m0B440h/ink.gif)

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
