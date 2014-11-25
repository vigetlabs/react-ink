# React Ink

[![Build Status](https://travis-ci.org/vigetlabs/react-ink.png?branch=master)](https://travis-ci.org/vigetlabs/react-ink)

Add ink to any react component.

![Ink Gif](http://cl.ly/image/1r36102z0M3r/ink.gif)

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

There are several options available for how `<Ink />` renders, see the [`getDefaultProps()` declaration](https://github.com/vigetlabs/react-ink/blob/master/src/index.js#L33-L37), however descriptions follow:


## Configuration

```javascript
{
  background : true, // When true, pressing the ink will cause the background to fill with the current color
  duration   : 1500, // Duration of the full animation completion
  opacity    : 0.2,  // The opacity of the ink blob
  radius     : 150,  // The size of the effect, will not exceed bounds of containing element
  recenter   : true   // When true, recenter will pull ink towards the center of the containing element
}
```
