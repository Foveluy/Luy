'use strict'

const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
const eslintFormatter = require('react-dev-utils/eslintFormatter')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const getClientEnvironment = require('./env')
const paths = require('./paths')
const { resolve } = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  context: __dirname,
  entry: [require.resolve('./polyfills'), require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs],
  output: {
    path: resolve(__dirname, 'build'), //打包后的文件存放的地方
    filename: 'bundle.js', //打包后输出文件的文件名
    publicPath: '/'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.(ts|tsx)?$/, loader: 'ts-loader' },
      {
        test: /\.(js|jsx)?$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader' //在webpack-dev中不能使用--hot
      }
    ]
  },
  mode: 'development',
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            unsafe_comps: true,
            properties: true,
            keep_fargs: false,
            pure_getters: true,
            collapse_vars: true,
            unsafe: true,
            warnings: false,
            screw_ie8: true,
            sequences: true,
            dead_code: true,
            drop_debugger: true,
            comparisons: true,
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            unused: true,
            hoist_funs: true,
            if_return: true,
            join_vars: true,
            cascade: true,
            drop_console: true
          }
        }
      })
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ],
  devtool: 'cheap-module-eval-source-map'
}
