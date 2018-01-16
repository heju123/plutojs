const path = require('path');

function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = function(env){
    var cleanWebpackPlugin = require('clean-webpack-plugin');

    var devtool = "source-map";
    var plugins = [];
    plugins.push(new cleanWebpackPlugin(['**'],
        {
            root: 'D:\\nodeProjects\\plutoTest\\node_modules\\plutojs',
            verbose: true,
            dry: false
        }));

    return {
        entry: __dirname + '/test/src/js/main.js',
        output: {
            path: __dirname + '/test/build',
            publicPath : "/build/",
            filename: "bundle.js",
            chunkFilename: '[name].chunk.js'
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
        plugins: plugins
    };
};