const path = require('path');
const webpack = require('webpack');

function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = function(env){
    var cleanWebpackPlugin = require('clean-webpack-plugin');

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
            path: __dirname + '/test/build',
            publicPath : "/build/",
            filename: "[name].js",
            chunkFilename: '[name].[chunkhash:5].chunk.js'
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
            new cleanWebpackPlugin(['test/build/**'],
                {
                    root: '',
                    verbose: true,
                    dry: false
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
            })
        ]
    };
};