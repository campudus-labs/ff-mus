var webpackTestConfig = require('./webpack.config');
webpackTestConfig.devtool = 'inline-source-maps';
webpackTestConfig.module.preLoaders = (webpackTestConfig.module.preLoaders || []).concat([{
  test : /\.jsx?$/,
  loaders : ['isparta'],
  exclude : /node_modules|\.spec\.js$/
}]);

module.exports = function (config) {
  config.set({
    browsers : ['Chrome'],
    singleRun : true,
    frameworks : ['chai', 'mocha'],
    files : ['src/frontend/**/*.spec.js'],
    plugins : [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],
    preprocessors : {
      'src/frontend/**/*.spec.js' : ['webpack', 'sourcemap']
    },
    reporters : ['mocha', 'coverage'],
    webpack : webpackTestConfig,
    webpackServer : {
      noInfo : true
    },
    coverageReporter : {
      type : 'html',
      dir : 'coverage/'
    }
  });
};
