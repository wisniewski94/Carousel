const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: {
    bundle: './docs/engine.js',
  },
  devServer: {
    port: 3001,
    contentBase: path.resolve(__dirname, 'dist'),
    watchContentBase: true,
    writeToDisk: false,
    hot: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './docs/markdown/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: './docs/styles/[name].[hash].css'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.html$/,
      use: ['html-loader']
    }, {
      test: /\.s[ac]ss$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    }],
  },

}