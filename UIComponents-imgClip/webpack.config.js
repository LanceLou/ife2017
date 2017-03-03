var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname,
    filename: 'src/main-o.js'
  },
  module: {
    loaders: [
      // {test: /\.css$/, loader: 'style!css'},
      {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
               compact: false // because I want readable output
            }
         }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('This file is created by lancelou')
  ]
}
