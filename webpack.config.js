var compile_mode = "dev";

var cleanWebpackPlugin = require('clean-webpack-plugin');
var uglifyJsPlugin = require('uglify-js-plugin');

var devtool = "source-map";
var plugins = [];
plugins.push(new cleanWebpackPlugin(['*.{js,map}', 'images/*.{png,jpg,jpeg,gif}'],
  {
    root: 'F:\\monkTest\\libs\\monk',
    verbose: true,
    dry: false
  }))
if (compile_mode == "prod") {
  plugins.push(new uglifyJsPlugin({
    compress: true, //default 'true', you can pass 'false' to disable this plugin
    debug: true, //default 'false', it will display some information in console
    sourceMap: true
  }));
  devtool = "D:\\nodeProjects\\monkTest\\libs\\monk";
}
//'D:\\nodeProjects\\monkTest\\libs\\monk'
module.exports = {
  entry: __dirname + '/src/js/main.js',
  output: {
      path: 'F:\\monkTest\\libs\\monk',
      publicPath : "/build/",
      filename: "monk.js",
      chunkFilename: '[name].[chunkhash:5].chunk.js'
  },
  devtool: devtool,  //生成source file
  module: {
    loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }
    ]
  },
  plugins: plugins
};