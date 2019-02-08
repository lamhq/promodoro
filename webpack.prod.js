/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = (env) => {
  return merge(common(env), {
    mode: 'production',
    devtool: 'source-map',
    output: {
      filename: 'scripts.[chunkhash].js',
    },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin(),
      ],
    },
    plugins: [
      // Extract css from the bundle into a separate file.
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: 'styles.[name].[hash].css',
        chunkFilename: 'styles.[id].[hash].css',
      }),
    ],
  });
};
