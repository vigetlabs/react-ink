var Path = require('path');
var WebPack = require('webpack');

module.exports = {
  entry: './index.js',

  output: {
    path: __dirname,
    publicPath: './',
    filename: 'example.build.js'
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
