var Types     = require('react').PropTypes
var invariant = require('react/lib/invariant');

module.exports = function(lower, upper) {

  invariant(lower < upper, 'Lower limit of type `inRange` must be greater than upper limit');

  return function(props, name, component) {
    if (props && name in props === false) return;

    var checkNumber = Types.number(props, name, component);

    if (checkNumber) return checkNumber;

    var value = props[name];

    if (value < lower || value > upper) {
      return new RangeError(`Invalid \`${ name }\` value given to component \`${ component }\`. Expected between ${ lower } and ${ upper }, instead got ${ value }.`);
    }
  }

};
