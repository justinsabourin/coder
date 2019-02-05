process.noDeprecation = true;
const path = require('path');
var webpack = require('webpack');
console.log(path.resolve(__dirname, 'frontend', 'src', 'index.jsx'));
module.exports = {
  mode: 'none',
  entry: [
    path.resolve('frontend', 'src', 'index.tsx'),
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:8081'
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

  output: {
    path: path.resolve('frontend', 'public', 'js'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8081/js/'
  },

  devtool: 'source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],

  module: {
    rules: [{
      test: /\.(t|j)sx?$/,
      exclude: /node_modules/,
      loader: 'awesome-typescript-loader'
    }, {
      enforce: 'pre',
      test: /\.js$/,
      loader: "source-map-loader"
    }]
  }
};