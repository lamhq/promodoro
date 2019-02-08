/* eslint-disable import/no-extraneous-dependencies */
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const outputDir = path.resolve(__dirname, 'dist/renderer');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/renderer/index.jsx'],
  },
  output: {
    path: outputDir,
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin([outputDir]),
    // Automatically generate an HTML5 file for you that includes all your webpack bundles
    new HtmlWebpackPlugin({
      title: 'Promodoro',
      favicon: './src/renderer/assets/favicon.ico',
      template: './src/renderer/index.html',
    }),
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.jsx'],
    // Tell webpack what directories should be searched when resolving modules.
    modules: ['node_modules'],
  },
  module: {
    rules: [
      // load image
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      // load font
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      // load javascript/react components
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
