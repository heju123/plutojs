const path = require('path');
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = function(env){
    var devtool = "source-map";

    return {
        entry: {
            vendor: [
                "./libs/TweenLite/TweenMax.min.js",
                "./libs/TweenLite/easing/EasePack.min.js",
                "./libs/TweenLite/plugins/ColorPropsPlugin.min.js"
            ],
            app: __dirname + '/test/src/js/main.js'
        },
        output: {
            path: __dirname + '/test/dist',
            publicPath : "/",
            filename: "[name].[chunkhash].js",
            chunkFilename: '[name].[chunkhash].chunk.js'
        },
        devtool: devtool,  //生成source file
        resolve: {
            extensions: ['.ts', '.js']
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
            new cleanWebpackPlugin(['test/dist/**'],
                {
                    root: '',
                    verbose: true,
                    dry: false
                }),
            new htmlWebpackPlugin({
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
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                // filename: "vendor.js"
                // (Give the chunk a different name)

                minChunks: Infinity,
                // (with more entries, this ensures that no other module
                //  goes into the vendor chunk)
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
                minChunks: Infinity
            }),
            new copyWebpackPlugin([
                { from: 'test/src/images', to: 'images' },
                {from: 'test/src/maps', to: 'maps'}
            ]),
            // keep module.id stable when vender modules does not change
            new webpack.HashedModuleIdsPlugin()
        ]
    };
};