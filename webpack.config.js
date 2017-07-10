var compile_mode = "dev";

var cleanWebpackPlugin = require('clean-webpack-plugin');
var uglifyJsPlugin = require('uglify-js-plugin');

var devtool = "source-map";
var plugins = [];
plugins.push(new cleanWebpackPlugin(['build/*.{js,map}', 'build/images/*.{png,jpg,jpeg,gif}', 'build/font/*.woff'],
  {
    root: '',
    verbose: true,
    dry: false
  }));
if (compile_mode == "prod") {
  plugins.push(new uglifyJsPlugin({
    compress: true, //default 'true', you can pass 'false' to disable this plugin
    debug: true, //default 'false', it will display some information in console
    sourceMap: true
  }));
  devtool = "cheap-module-source-map";
}
//'E:\\git\\MediaManagementSuite\\Src\\App\\ContentCenter\\Web\\src\\libs\\mam'
module.exports = {
  entry: __dirname + '/src/js/build/main.js',
  output: {
    filename: 'mam-user-selector.js',
    chunkFilename: '[name].[chunkhash:5].chunk.js'
  },
  devtool: devtool,  //生成source file
  module: {
    loaders: [
      { test: /\.(css|scss)$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.(jpg|png)$/, loader: 'url-loader?limit=16384&name=images/[name].[hash].[ext]' }
    ]
  },
  plugins: plugins
};