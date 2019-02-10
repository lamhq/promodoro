/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDir = path.resolve(__dirname, 'build/main');

module.exports = (env) => {
  return {
    mode: 'production',
    target: 'electron-main',
    entry: {
      app: ['babel-polyfill', './src/main/index.js'],
    },
    output: {
      path: outputDir,
      filename: 'index.js',
    },
    node: {
      __dirname: false,
    },
    optimization: {
      minimize: false,
    },
    plugins: [
      new CleanWebpackPlugin([outputDir]),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
      }),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.jsx'],
      // Tell webpack what directories should be searched when resolving modules.
      modules: ['node_modules'],
    },
    module: {
      rules: [
        // load javascript/react components
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
  };
};
