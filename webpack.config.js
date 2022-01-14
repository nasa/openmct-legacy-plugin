//Webpack requires this to work with directories
const path =  require('path');

// This is main configuration object that tells Webpackw what to do. 
module.exports = {
    //path to entry paint
    entry: './src/plugin.js',
    //path and filename of the final output
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'plugin.js',
        library: '[name]',
        libraryTarget: 'umd',
    },
    
    module: {
        rules: [{
            test: /\.html$/,
            use: 'html-loader'
        }, {
            test: /zepto/,
            use: [
                "imports-loader?this=>window",
                "exports-loader?Zepto"
            ]
        }]
    },

    resolve: {
        alias: {
            "saveAs": "file-saver",
            "csv": "comma-separated-values",
            "objectUtils": path.join(__dirname, "src/object-utils.js"),
        }
    },

    devtool: "inline-source-map"
}
