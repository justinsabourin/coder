process.noDeprecation = true;
var webpack = require('webpack');
module.exports = {
   mode: 'production',
   entry: __dirname + '/frontend/src/index.jsx',
	
   output: {
      path: __dirname + '/frontend/public/js/',
      filename: 'bundle.js',
   },

    plugins:  [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ],

    devtool: false,

    optimization: {
       minimize: true
    },
    

    module: {
      rules: [
          {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              
              options: {
                  presets: ['@babel/preset-env', '@babel/preset-react'],
                  plugins: ["babel-plugin-styled-components"]
              }
          }
      ]
  }
};
