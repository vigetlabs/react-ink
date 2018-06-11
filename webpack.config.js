const path = require('path')

module.exports = {
  entry: './example/index.js',

  output: {
    path: path.resolve('example'),
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
    publicPath: '/'
  }
}
