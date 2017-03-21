process.noDeprecation = true;
var webpack = require('webpack');
module.exports = {
   entry: [ 
       'webpack-hot-middleware/client', 
        __dirname + '/frontend/src/index.jsx'
    ],
	
   output: {
      path: __dirname + '/frontend/public/js/',
      filename: 'bundle.js',
      publicPath: 'https://localhost:8080/js/'
   },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
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
