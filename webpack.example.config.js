var Path    = require('path');
var WebPack = require('webpack');

module.exports = {
  entry: {
    'example.build': './example/index.js'
  },

  output: {
    path: './example',
    publicPath: 'example',
    filename: '[name].js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    modulesDirectories: [ 'web_modules', 'node_modules' ]
  },

  module: {
    loaders: [
      {
        test    : /\.jsx*$/,
        exclude : /node_modules/,
        loader  : 'envify!6to5?experimental'
      },
      {
        test    : /\.json$/,
        loader  : 'json-loader'
      }
    ]
  }
}
