module.exports = {
  devtool: 'eval',

  entry: {
    basic: [
      './examples/basic.js',
      './examples/basic.html'
    ]
  },

  output: {
    path: __dirname + '/build',
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      },

      {
        test: /\.html$/,
        loader: 'file?name=[name].html'
      }
    ]
  }
}
