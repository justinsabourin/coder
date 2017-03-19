var webpack = require('webpack')
module.exports = {
   entry: __dirname + '/src/index.jsx',
	
   output: {
      path: __dirname + '/public/js/',
      publicPath: '/js/',
      filename: 'bundle.js',
   },
	
   devServer: {
       contentBase: __dirname + '/public/',
       hot: true,
       port: 8081,
   },

    plugins: process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ] : [],
    

   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
				
            query: {
               presets: ['es2015' ,'react', 'stage-2']
            }
         }
      ]
   }
};
