'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = {
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src']
  },
  entry: {
    app: [
      'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './src/ui/entry.jsx' // Your appʼs entry point
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/public/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loaders:
        ['react-hot', 'babel-loader?stage=0&optional=runtime']},

      {test: /\.less$/, loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}!less-loader'},

      {test: /\.(?:eot|ttf|woff2?)$/, loader: 'file-loader?name=[path][name]-[hash:6].[ext]&context=assets'}
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Radium: 'radium',
      '_': 'lodash'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'eval-source-map'
}
