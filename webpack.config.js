//'D:\\nodeProjects\\monkTest\\libs\\monk'
module.exports = function(env){
    var compile_mode = env;

    var cleanWebpackPlugin = require('clean-webpack-plugin');
    var uglifyJsPlugin = require('uglify-js-plugin');

    var devtool = "source-map";
    var plugins = [];
    plugins.push(new cleanWebpackPlugin(['*.{js,map}', 'images/*.{png,jpg,jpeg,gif}'],
        {
            root: 'F:\\projects\\monkTest\\libs\\monk',
            verbose: true,
            dry: false
        }))
    if (compile_mode == "prod") {
        plugins.push(new uglifyJsPlugin({
            compress: true, //default 'true', you can pass 'false' to disable this plugin
            debug: true, //default 'false', it will display some information in console
            sourceMap: true
        }));
        devtool = "cheap-module-source-map";
    }

    return {
        entry: __dirname + '/src/js/main.ts',
        output: {
            path: 'F:\\projects\\monkTest\\libs\\monk',
            publicPath : "/build/",
            filename: "monk.js",
            chunkFilename: '[name].[chunkhash:5].chunk.js'
        },
        devtool: devtool,  //生成source file
        resolve: {
            extensions: ['.ts', '.js']
        },
        module: {
            loaders: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader'
                }
            ]
        },
        plugins: plugins
    };
};