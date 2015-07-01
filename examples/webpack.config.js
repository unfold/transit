module.exports = {
  devtool: 'eval',

  entry: [
    __dirname + '/index.html',
    __dirname + '/index.js'
  ],

  output: {
    path: __dirname + '/build',
    filename: 'index.js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel?cacheDirectory'
      },

      {
        test: /\.html$/,
        loader: 'file?name=[name].html'
      }
    ]
  }
}
