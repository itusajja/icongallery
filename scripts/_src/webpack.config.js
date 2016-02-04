var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: ['./src/entry.jsx'],

  output: {
    path: path.join(__dirname, '../'),
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: [
      'node_modules'
    ]
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader?presets[]=es2015&presets[]=react'
        ]
      }
    ]
  }
}
