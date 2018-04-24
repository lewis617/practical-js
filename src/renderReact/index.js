const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const open = require('open');
const FallbackPort = require('fallback-port');

const fallbackPort = new FallbackPort(3000);
const port = fallbackPort.getPort();
const getConfig = require('./getConfig');
const webpackConfig = getConfig(port);
const compiler = webpack(webpackConfig);

let buildFirstTime = true;
compiler.plugin('done', (stats) => {
  if (stats.hasErrors()) {
    console.log(stats.toString({ colors: true }));
  }
  // 只有第一次启动start的时候才执行
  if (buildFirstTime) {
    buildFirstTime = false;
    // listening
    console.log('[webpack-dev-server]', `http://localhost:${port}`);
    console.log('[webpack-dev-server]', 'To stop service, press [Ctrl + C] ..');
    open(`http://localhost:${port}/rrc`);
  }
});

new WebpackDevServer(compiler, {
  hot: true,
  inline: true,
  quiet: true,
  headers: { 'Access-Control-Allow-Origin': '*' }
}).listen(port, '0.0.0.0');