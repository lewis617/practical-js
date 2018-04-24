const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const FallbackPort = require('fallback-port');

const fallbackPort = new FallbackPort(3000);
const port = fallbackPort.getPort();
const getConfig = require('./getConfig');
const webpackConfig = getConfig(port);
const compiler = webpack(webpackConfig);

new WebpackDevServer(compiler, {
  hot: true,
  inline: true,
  quiet: true,
  headers: { 'Access-Control-Allow-Origin': '*' }
}).listen(port, '0.0.0.0');