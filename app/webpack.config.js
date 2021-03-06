process.noDeprecation = true;
var webpack = require('webpack');
module.exports = {
   entry: __dirname + '/frontend/src/index.jsx',
	
   output: {
      path: __dirname + '/frontend/public/js/',
      filename: 'bundle.js',
   },

    plugins:  [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ],
    

   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
				
            query: {
               presets: ['es2015', 'react', 'stage-2']
            }
         }
      ]
   }
};
