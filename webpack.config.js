var base = require('./webpack.config')
var path = require('path')

module.exports = function (env) {
  let isExample = env === 'example'

  var config = {

    entry: {
      ink: isExample ? './example/index.js' : './src/index.js'
    },

    devtool: 'inline-source-map',

    output: {
      path: path.resolve(isExample ? './example' : './dist'),
      filename: '[name].js'
    },

    module: {
      rules: [{
        test    : /\.jsx*$/,
        exclude : /node_modules/,
        loader  : 'babel-loader'
      }]
    },

    devServer: {
      contentBase: path.resolve('./example'),
      publicPath: '/',
      quiet: true
    }
  }

  if (isExample === false) {
    config.output.libraryTarget = 'commonjs2'

    config.externals = {
      react: 'react'
    }
  }

  return config
}
