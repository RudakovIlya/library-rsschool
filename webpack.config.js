const path = require('path');
const fs = require('fs');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Look for .html files
const createHTMLFiles = () => {
  const htmlFiles = [];
  const directories = ['src'];

  while (directories.length > 0) {
    const directory = directories.pop();
    const dirContents = fs.readdirSync(directory)
      .map(file => path.join(directory, file));

    htmlFiles.push(...dirContents.filter(file => file.endsWith('.html')));
    directories.push(...dirContents.filter(file => fs.statSync(file).isDirectory()));
  }

  return htmlFiles
}

module.exports = (env) => {
  const mode = env.mode || 'development'
  const isDev = mode === 'development'

  const devServer = {
    port: 3000,
    open: true,
    hot: true,
    static: path.join(__dirname, 'src'),
  }

  return {
    mode: mode,
    entry: path.resolve(__dirname, 'src', 'index.js'),
    module: {
      rules: [
        {
          test: /\.html$/i,
          use: 'html-loader'
        },
        {
          test: /\.(png|jpg|ico)$/i,
          type: 'asset',
          use: [
            {
              loader: 'image-webpack-loader',
              options: {
                pngquant: {
                  quality: [.90, .95],
                },
              }
            }
          ],
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024 // Inline anything under 10kb
            }
          },
          generator: {
            filename: 'images/[name]-[contenthash][ext]'
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader"
            },
            'sass-loader',
          ],
        },
      ]
    },
    output: {
      filename: 'js/[name].[contenthash].js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
    },
    plugins: [
      ...createHTMLFiles().map(htmlFile =>
        new HtmlWebpackPlugin({
          template: htmlFile,
          filename: htmlFile.replace(path.normalize("src/"), ""),
        })
      ),
      new webpack.ProgressPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css',
      }),
      isDev ? new webpack.HotModuleReplacementPlugin() : undefined
    ].filter(Boolean),
    resolve: {
      extensions: ['', '.js', '.scss'],
      modules: ['src', 'node_modules']
    },
    devServer: isDev ? devServer : undefined,
    devtool: isDev ? 'inline-source-map' : undefined,
  }
}
