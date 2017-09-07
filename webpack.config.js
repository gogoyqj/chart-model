var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        entry: [
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            path.resolve(__dirname, './demo.js')
        ]
    },
    output: {
        path:  path.resolve(__dirname, './build/'),
        publicPath: '//localhost:8080/build/',
        filename: 'demo.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        port: 8080,
        hot: true,
        inline: true,
        stats: {colors: true}
    },
    devtool: '#source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'react-hot-loader'
                }, {
                    loader: 'babel-loader'
                }]
            },
            {   test: /\.less$/,
                use: [
                    'react-hot-loader',
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    }
}
