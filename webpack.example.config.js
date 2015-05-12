module.exports = {
  entry: './example/index.js',
  devtool: 'source-map',

  output: {
    path: './example',
    publicPath: 'example',
    filename: 'example.build.js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      {
        test    : /\.jsx*$/,
        exclude : /node_modules/,
        loader  : 'babel'
      }
    ]
  }
}
