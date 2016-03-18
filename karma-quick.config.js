var webpackTestConfig = require('./webpack.config');
webpackTestConfig.devtool = 'inline-source-maps';

module.exports = function (config) {
  config.set({
    browsers : ['Chrome'],
    frameworks : ['chai', 'mocha'],
    files : ['src/frontend/**/*.spec.js'],
    plugins : [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],
    preprocessors : {
      'src/frontend/**/*.spec.js' : ['webpack']
    },
    reporters : ['mocha'],
    webpack : webpackTestConfig,
    webpackServer : {
      noInfo : true
    },
    autoWatch : true
  });
};
