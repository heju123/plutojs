const path = require('path');
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');

function resolvePath(subdir) {
    return path.join(__dirname, ".", subdir);
}

module.exports = function(arg1, mode){
    var compile_mode = mode.mode;

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
            rules: [
                {
                    test: /\.(ts|js)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: false
                            }
                        }
                    ]
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
            new webpack.HashedModuleIdsPlugin(),
        ],
        devServer: {
            contentBase: __dirname + "/test",
            port: 6002,
            open:true,
            hot:true
        }
    };

    output.entry.app = __dirname + '/test/src/js/main.js';
    output.devtool = "source-map";
    output.output.chunkFilename = "[name].chunk.js";
    output.resolve.alias['~'] = resolvePath('src');
    output.optimization = {};

    output.resolve.alias['@'] = resolvePath('test/src');

    output.entry.vendor = [
        "./libs/TweenLite/TweenMax.min.js",
        "./libs/TweenLite/easing/EasePack.min.js",
        "./libs/TweenLite/plugins/ColorPropsPlugin.min.js"
    ];

    output.plugins.push(new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'test/index.html',
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            minifyCSS: true
        },
        chunksSortMode: 'dependency'
    }));

    output.plugins.push(new copyWebpackPlugin([
        { from: 'test/src/images', to: 'images' },
        {from: 'test/src/maps', to: 'maps'},
        {from: 'test/libs', to: 'libs'},
        {from: 'test/fonts', to: 'fonts'}
    ]));

    return output;
};