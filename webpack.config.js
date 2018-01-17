const path = require('path');
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const uglifyJsPlugin = require('uglify-js-plugin');

function resolvePath(subdir) {
    return path.join(__dirname, ".", subdir);
}

module.exports = function(env){
    var compile_mode = env;

    var output = {
        entry : {},
        output: {
            path: __dirname + '/dist',
            publicPath : "/",
            chunkFilename: '[name].[chunkhash].chunk.js'
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {}
        },
        module: {
            loaders: [
                {
                    test: /\.(ts|js)$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader'
                }
            ]
        },
        plugins: [
            new cleanWebpackPlugin(['dist/**'],
                {
                    root: '',
                    verbose: true,
                    dry: false
                }),
            // keep module.id stable when vender modules does not change
            new webpack.HashedModuleIdsPlugin()
        ]
    };

    output.entry.app = __dirname + '/test/src/js/main.js';
    output.devtool = "source-map";
    output.output.filename = "[name].[chunkhash].js";
    output.resolve.alias['~'] = resolvePath('src');

    if (compile_mode == "prod")
    {
        output.entry.app = __dirname + '/build/build.js';
        output.devtool = "cheap-module-source-map";
        output.output.filename = "[name].js";

        output.plugins.push(new uglifyJsPlugin({
            compress: true, //default 'true', you can pass 'false' to disable this plugin
            debug: true, //default 'false', it will display some information in console
            sourceMap: true
        }));
    }
    else//test
    {
        output.resolve.alias['@'] = resolvePath('test/src');

        output.entry.vendor = [
            "./libs/TweenLite/TweenMax.min.js",
            "./libs/TweenLite/easing/EasePack.min.js",
            "./libs/TweenLite/plugins/ColorPropsPlugin.min.js"
        ];

        output.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            // filename: "vendor.js"
            // (Give the chunk a different name)

            minChunks: Infinity,
            // (with more entries, this ensures that no other module
            //  goes into the vendor chunk)
        }));

        output.plugins.push(new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }));

        output.plugins.push(new htmlWebpackPlugin({
            filename: 'index.html',
            template: 'test/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                minifyCSS: true
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }));

        output.plugins.push(new copyWebpackPlugin([
            { from: 'test/src/images', to: 'images' },
            {from: 'test/src/maps', to: 'maps'}
        ]));
    }

    return output;
};