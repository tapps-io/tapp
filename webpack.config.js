/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const path = require('path');
const { DefinePlugin, ProvidePlugin } = require('webpack');
const RenderPlugin = require('./tools/render-plugin.js');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const context = path.join(process.cwd(), 'src');
const isDevServer = !!process.argv.find(v => v.includes('webpack-dev-server'));
const compileModules = ['@trutoo'];

/* Changes to package.json and dev.config.json needs a restart */
const metadata = require('./package.json');
const weakHook = `${metadata.name.replace(/@/g, '').replace(/(\/|\.)/g, '_')}`;
const hook = `${weakHook}_${metadata.version.replace(/\./g, '-')}`;
const tappConfig = `<script>window.tappConfigs={"${hook}":${JSON.stringify(
  require(path.join(context, 'dev.config.json')),
)}}</script>`;

module.exports = (_, argv) => ({
  context: context,
  entry: ['./main.tsx'],
  mode: argv.mode || 'development',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: [context, 'node_modules'],
  },
  module: {
    rules: [
      {
        // Source files and non-compiled node_modules
        test: /\.(js|ts)x?$/,
        exclude: new RegExp(`node_modules\\${path.sep}(?!${compileModules.join('|')})`),
        use: ['babel-loader'],
      },
      {
        // Only source files
        test: /\.(js|ts)x?$/,
        include: context,
        use: [
          path.resolve('./tools/doc-gen-loader.js'),
          { loader: 'prettier-loader', options: { parser: 'typescript' } },
        ],
      },
      {
        // All CSS files
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDevServer,
            },
          },
        ],
      },
      {
        // All CSS module files
        test: /\.css$/,
        include: /\.module\.css$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: argv.mode === 'production' ? '[hash:base64]' : '[local]_[hash:base64:7]',
              },
            },
          },
          { loader: 'postcss-loader', options: { config: { ctx: { wrap: `.${hook}`, modules: true } } } },
        ],
      },
      {
        // All CSS non-module files
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['css-loader', { loader: 'postcss-loader', options: { config: { ctx: { wrap: `.${hook}` } } } }],
      },
      {
        // All CSS source files
        test: /\.css$/,
        include: context,
        use: [{ loader: 'prettier-loader', options: { parser: 'css' } }],
      },
      {
        // All other assets
        test: /\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new DefinePlugin({
      isDevServer,
      hook: JSON.stringify(hook),
      weakHook: JSON.stringify(weakHook),
    }),
    new StyleLintPlugin({
      files: '**/*.css',
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({ template: 'index.html', hook, tappConfig }),
    new ForkTsCheckerWebpackPlugin({
      tsconfig: path.resolve('tsconfig.json'),
      eslint: true,
      checkSyntacticErrors: true,
    }),
    new RenderPlugin(hook),
  ].concat(
    isDevServer
      ? [
          new ProvidePlugin({
            Promise: ['core-js/es/promise'], // Polyfill promises for react-hot-reload on dev servers
          }),
        ]
      : [],
  ),

  devServer: {
    contentBase: [path.resolve('dist'), path.resolve('node_modules')],
    host: '0.0.0.0',
    compress: true,
    port: 3002,
    hot: true,
  },

  performance: {
    maxEntrypointSize: 512000,
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {},
          output: {
            ascii_only: true, // eslint-disable-line @typescript-eslint/camelcase
            webkit: true,
          },
          compress: {
            typeofs: false,
            inline: 3,
            pure_getters: true, // eslint-disable-line @typescript-eslint/camelcase
            passes: 3,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: [
            'default',
            {
              calc: false,
            },
          ],
        },
      }),
    ],
  },

  devtool: isDevServer ? 'cheap-module-eval-source-map' : false,
});
