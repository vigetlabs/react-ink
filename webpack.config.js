var Path = require('path')
var WebPack = require('webpack')

module.exports = {
  entry: './src/index.jsx',

  output: {
    libraryTarget: 'commonjs2',
    path: Path.resolve(__dirname, 'dist'),
    filename: 'ink.js'
  },

  externals: {
    react: 'react',
    'react-dom': 'react-dom'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [{
      test    : /\.jsx*$/,
      exclude : /node_modules/,
      loader  : 'babel'
    }]
  }
}
