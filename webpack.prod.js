const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
module.exports = {
  mode: 'production',
  entry: {
    bundle: './src/engine.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.[hash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].[hash].css'
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [{
      test: /\.s[ac]ss$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    }],
  },

}