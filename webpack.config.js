var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: ["./_src/scripts/entry.jsx"],

  output: {
    path: path.join(__dirname, "./static/scripts/"),
    filename: "search.min.js"
  },

  resolve: {
    extensions: [".js", ".jsx"]
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loaders: [
          "babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-1"
        ]
      }
    ]
  }
};
