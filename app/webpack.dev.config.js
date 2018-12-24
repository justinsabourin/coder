process.noDeprecation = true;
const path = require('path');
var webpack = require('webpack');
console.log(path.resolve(__dirname, 'frontend', 'src', 'index.jsx'));
module.exports = {
   mode: 'none',
   entry: [ 
        path.resolve('frontend', 'src', 'index.jsx'),
        'webpack/hot/only-dev-server',
        'webpack-dev-server/client?http://localhost:8081'
    ],
	
   output: {
      path: path.resolve('frontend', 'public', 'js'),
      filename: 'bundle.js',
      publicPath: 'http://localhost:8081/js/'
   },

   devtool: 'inline-source-map',

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],

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
