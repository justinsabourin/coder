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
   

   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
				
            query: {
               presets: ['react']
            }
         }
      ]
   }
};
