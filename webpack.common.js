/* eslint-disable import/no-extraneous-dependencies */
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const outputDir = path.resolve(__dirname, 'dist/renderer');

module.exports = (env) => {
  return {
    entry: {
      app: ['babel-polyfill', './src/renderer/index.jsx'],
    },
    output: {
      path: outputDir,
      filename: 'bundle.js',
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
        /**
          * Load css file
          */
        {
          test: /\.css$/,
          loader: [
            // extract CSS into separate files
            env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        // load local less file
        {
          test: /\.less$/,
          include: [
            path.resolve(__dirname, 'src/renderer'),
          ],
          loader: [
            // extract CSS into separate files
            env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
            // allow importing css files
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: '[name]_[local]_[hash:base64:5]',
              },
            },
            // compile less to css
            'less-loader',
          ],
        },
        // load ant design less file
        {
          test: /\.less$/,
          include: [
            path.resolve(__dirname, 'node_modules/antd'),
          ],
          loader: [
            env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
              },
            },
          ],
        },
      ],
    },
  };
};
