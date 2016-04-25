var base = require('./webpack.config')

module.exports = {
  entry: './example/index.js',
  devtool: 'source-map',

  output: {
    path: './example',
    publicPath: 'example',
    filename: 'example.build.js'
  },

  resolve : base.resolve,
  module  : base.module
}
