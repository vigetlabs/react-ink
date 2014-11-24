var Types = require('react').PropTypes

module.exports = function(min) {

  return function(props, name, component) {
    if (props && name in props === false) return;

    var checkNumber = Types.number(props, name, component);

    if (checkNumber) return checkNumber;

    var value = props[name]

    if (value < min) {
      return new RangeError(`Invalid \`${ name }\` value given to component \`${ component }\`. Expected >= ${ min} , instead got ${ value }.`);
    }
  }

};
