/* eslint-disable no-undef */
/* !
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");

// const fs = require("fs");
// const https = require("https");

module.exports = (env) => {
  return {
    devServer: {
      host: "192.168.1.72",
      // port: 8080,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      watchOptions: {
        ignored: "**/node_modules/**",
      },
      https: {
        key: fs.readFileSync("./host.key"),
        cert: fs.readFileSync("./host.crt"),
      },
    },
    entry: {
      app: "./src/app.tsx",
    },
    resolve: {
      fallback: {
        util: require.resolve("util/"),
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        
      },
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader", options: {
                    url: false,
                            importLoaders: 2,
                            modules: {
                              mode: 'local'
                              },
                          },
              
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          loader: "url-loader",
          options: {
            limit: 10000,
          },
        },
      ],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      library: "[name]",
      // https://github.com/webpack/webpack/issues/5767
      // https://github.com/webpack/webpack/issues/7939
      devtoolNamespace: "RoleModels",
      // This is required to run webpacked code in webworker/node
      // https://github.com/webpack/webpack/issues/6522
      globalObject: "(typeof self !== 'undefined' ? self : this)",
      libraryTarget: "umd",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
    mode: "development",
    devtool: "inline-source-map",
  };
};
