const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./_src/scripts/entry.jsx",

  output: {
    path: path.resolve(__dirname, "./static/scripts/"),
    filename: "search.min.js"
  },

  resolve: {
    extensions: [".js", ".jsx"]
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          // Sticking our babel-configuration here rather than package.json
          // or a .babelrc file.
          // This is a really minimal configuration
          options: {
            presets: [
              "env", // ES2015
              "react" // JSX
            ],
            plugins: [
              "transform-class-properties", // static propTypes
              "transform-object-rest-spread" // { ...myObj, foo: 'bar' }
            ]
          }
        }
      }
    ]
  }
};
