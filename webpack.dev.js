/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      hot: true,
      open: false,
      contentBase: './dist/renderer',
      historyApiFallback: true,
      port: 4001,
      proxy: {
        '/api': 'http://localhost:4000',
      },
    },
    plugins: [
      // Enables Hot Module Replacement, otherwise known as HMR
      new webpack.HotModuleReplacementPlugin(),
    ],
  });
};
