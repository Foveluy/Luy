'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const { resolve } = require('path');

module.exports = {
    context: __dirname,
    entry: [
        require.resolve('./polyfills'),
        require.resolve('react-dev-utils/webpackHotDevClient'),
        paths.appIndexJs
    ],
    output: {
        path: resolve(__dirname, 'build'),//打包后的文件存放的地方
        filename: "bundle.js",//打包后输出文件的文件名
        publicPath: "/"
    },
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        hot: true,
        publicPath: '/',
    },
    resolve: {
        alias: {
            'react': 'anujs',
            'react-dom': 'anujs'
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'//在webpack-dev中不能使用--hot
            },

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ],
    devtool: "cheap-eval-source-map",
};