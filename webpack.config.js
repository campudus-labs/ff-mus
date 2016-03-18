var path = require('path');
var postcssImport = require('postcss-import');
var postcssEasyImport = require('postcss-easy-import');
var postcssUrl = require('postcss-url');
var autoprefixer = require('autoprefixer');
var postcssSimpleVars = require('postcss-simple-vars');
var postcssNested = require('postcss-nested');
var postcssMixins = require('postcss-mixins');
var postcssColorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var webpack = require('webpack');

module.exports = {
  devtool : process.env.NODE_ENV !== 'production' ? 'source-map' : '',
  entry : {
    index : path.resolve(__dirname, 'src/frontend/index.js')
  },
  output : {
    path : 'out/',
    filename : '[name].js'
  },
  module : {
    loaders : [{
      test : /\.jsx?$/,
      exclude : /node_modules/,
      loader : 'react-hot'
    }, {
      test : /\.jsx?$/,
      exclude : /node_modules/,
      loader : 'babel',
      query : {
        presets : ['es2015', 'react', 'stage-0']
      }
    }, {
      test : /\.s?css$/,
      loaders : ['style', 'css', 'postcss']
    }, {
      test : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader : 'file-loader'
    }, {
      test : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader : 'url-loader?limit=10000&minetype=application/font-woff'
    }, {
      test : /\.html$/,
      loader : "file?name=[name].[ext]"
    }]
  },
  plugins : [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV' : JSON.stringify(process.env.NODE_ENV !== 'production' ? 'development' : 'production')
    })
  ],
  postcss : function (webpack) {
    return [
      postcssImport({addDependencyTo : webpack}),
      postcssEasyImport({prefix : '_', extensions : ['.css', '.scss']}),
      postcssUrl,
      autoprefixer,
      postcssSimpleVars,
      postcssNested,
      postcssMixins,
      postcssColorFunction
    ].concat(process.env.NODE_ENV === 'production' ? [] : [cssnano()]);
  },
  resolve : {
    extensions : ['', '.js', '.jsx']
  }
};
