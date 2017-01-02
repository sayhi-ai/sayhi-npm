const webpack = require('webpack')

module.exports = {
  entry: "./src/index.js",
  devtool: 'sourcemap',
  target: 'node',
  module: {
    loaders: [
      {test: /\.json$/, loader: "json-loader"},
      {test: /\.jsx?$/, exclude: /(node_modules)/, loader: 'babel'}
    ]
  },
  output: {
    path: "./dev",
    filename: "lib.min.js",
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    })
  ]
}
