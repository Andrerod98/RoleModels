const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const fs = require('fs');

module.exports = (env) => {
  return {
    devServer: {
      host: '192.168.1.72',
      //port: 80,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      watchOptions: {
        ignored: '**/node_modules/**'
      },
      https: {
        key: fs.readFileSync('./certificates/host.key'),
        cert: fs.readFileSync('./certificates/host.crt')
      }
    },
    entry: {
      app: './src/App.tsx'
    },
    resolve: {
      fallback: {
        util: require.resolve('util/'),
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        path: false,
        os: require.resolve('os-browserify/browser'),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        zlib: require.resolve("browserify-zlib"),
        constants: require.resolve("constants-browserify")
      },
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader'
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader', options: {
                url: false,
                importLoaders: 2,
                modules: {
                  mode: 'local'
                }
              }

            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      ]
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      library: '[name]',
      devtoolNamespace: 'RoleModels',
      globalObject: '(typeof self !== \'undefined\' ? self : this)',
      libraryTarget: 'umd'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      })
    ],
    mode: 'development',
    devtool: 'inline-source-map'
  };
};
