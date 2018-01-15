module.exports = function(env){
    var cleanWebpackPlugin = require('clean-webpack-plugin');
    var copyWebpackPlugin = require('copy-webpack-plugin');

    var plugins = [];
    plugins.push(new cleanWebpackPlugin(['**'],
        {
            root: 'D:\\nodeProjects\\plutoTest\\node_modules\\plutojs',
            verbose: true,
            dry: false
        }));
    plugins.push(new copyWebpackPlugin([
        { from: 'src/**/*', to: 'D:\\nodeProjects\\plutoTest\\node_modules\\plutojs' }
    ]));

    return {
        entry: __dirname + '/test/test.js',
        output: {
            filename: "test.js"
        },
        plugins: plugins
    };
};