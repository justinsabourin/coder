process.noDeprecation = true;
var webpack = require('webpack');
module.exports = {
   entry: [ 
        __dirname + '/frontend/src/index.jsx',
        'webpack/hot/only-dev-server',
        'webpack-dev-server/client?http://localhost:8081'
    ],
	
   output: {
      path: __dirname + '/frontend/public/js/',
      filename: 'bundle.js',
      publicPath: 'http://localhost:8081/js/'
   },

    devtool: 'inline-source-map',

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                    
                query: {
                presets: ['es2015', 'react', 'stage-2', 'react-hmre']
                }
            },{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader?modules',
                ],
            },
        ]
    }
};
