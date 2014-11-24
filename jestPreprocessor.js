var ReactTools = require('react-tools')

module.exports = {
  process: function(code) {
    return ReactTools.transform(code, { harmony: true})
  }
}
