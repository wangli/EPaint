const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        index: './example/main.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'example',
            template: './example/index.html',
            filename: 'index.html',
        })
    ],
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ["@babel/env"]
                        ]
                    }
                }
            }
        ]
    },
    devServer: {
        host: '127.0.0.1',
        port: 1010,
        open: true,
    }
};
