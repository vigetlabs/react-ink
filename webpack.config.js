'use strict'

const base = require('./webpack.config')
const path = require('path')

module.exports = function(env) {
  const isExample = env === 'example'

  let config = {
    entry: {
      ink: isExample ? './example/index.js' : './src/index.js'
    },

    devtool: 'inline-source-map',

    output: {
      path: path.resolve(isExample ? './example' : './dist'),
      filename: '[name].js'
    },

    module: {
      rules: [
        {
          test: /\.jsx*$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          enforce: 'pre'
        },
        {
          test: /\.jsx*$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
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
