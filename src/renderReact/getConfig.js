const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cwd = process.cwd();

process.noDeprecation = true;

module.exports = (port) => {
  function getDevEntry() {
    const entry = {};
    glob.sync('./rrc/*.+(js|jsx|)', { cwd }).forEach((item) => {
      console.log(item);
      const file = item.replace(/.jsx?/, '');
      entry[file] = [
        `webpack-dev-server/client?http://0.0.0.0:${port}/`,
        'webpack/hot/only-dev-server',
        item,
      ];
    });
    return entry;
  }
  return {
    mode: 'development',
    context: cwd,
    devtool: 'cheap-module-eval-source-map',
    entry: getDevEntry(),
    output: {
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react', 'stage-0']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'raw-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [precss, autoprefixer],
              },
            },
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'raw-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [precss, autoprefixer],
              },
            },
            'less-loader',
          ]
        },
        {
          test: /\.html$/,
          use: [
            'raw-loader'
          ]
        }
      ],
    },
    plugins: [
      // 允许错误不打断程序
      new webpack.NoEmitOnErrorsPlugin(),

      // 进度插件
      new webpack.ProgressPlugin((percentage, msg) => {
        const stream = process.stderr;
        if (stream.isTTY && percentage < 0.71) {
          stream.cursorTo(0);
          stream.write(`📦   ${msg}`);
          stream.clearLine(1);
        }
      }),
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify('development') },
        __DEV__: JSON.stringify(JSON.parse('true')),
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ],
  }
}
