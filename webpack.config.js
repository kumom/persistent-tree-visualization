const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: ['./src/index.tsx'],
  output: {
    filename: 'main.js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist/'),
    publicPath: path.resolve(__dirname, '/persistent-bst/'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                "targets": "defaults",
                "useBuiltIns": "usage",
                "corejs": 3
              }],
              "@babel/preset-react"
            ]
          }
        },
      },
      {
        test: /\.css$/,
        oneOf: [
          {
            test: /\.module\.css$/,
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options: {
                  modules: {
                    mode: "local",
                    localIdentName: "[name]_[hash:base64:5]--[local]",
                    exportLocalsConvention: "camelCase",
                  }

                }
              },
            ]
          },
          {
            use: ["style-loader", "css-loader"]
          }
        ],
      },
    ],
  },
  devServer: {
    open: true,
    historyApiFallback: true,
    static: [
      {
        directory: path.join(__dirname, 'assets'),
        publicPath: '/persistent-bst/assets',
      },
      {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/',
      },
    ],
    devMiddleware: {
        writeToDisk: true,
    },
    liveReload: true,
    compress: true,
    hot: true,
    port: 8080
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // modules: ["node_modules"],
    plugins: [new TsconfigPathsPlugin({})],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist/index.html'),
      template: path.resolve(__dirname, 'src/index.html'),
      inject: "body"
    }),
  ],
};