var Path = require('path')

module.exports = {
  entry: './src/index.jsx',

  devtool: 'source-map',

  output: {
    libraryTarget: 'commonjs2',
    path: Path.resolve(__dirname, 'dist'),
    filename: 'ink.js'
  },

  externals: {
    react: 'react'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [{
      test    : /\.jsx*$/,
      exclude : /node_modules/,
      loader  : 'babel',
      query   : {
        stage : 2,
        loose : "all"
      },
    }]
  }
}



















