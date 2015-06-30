module.exports = {
  devtool: 'eval',

  entry: [
    './examples/index.html',
    './examples/index.js'
  ],

  output: {
    path: __dirname + '/build',
    filename: 'index.js'
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
