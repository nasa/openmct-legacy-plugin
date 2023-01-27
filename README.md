# Legacy Support for Open MCT
This is a plugin for [My NASA-Open MCT project](https://github.com/lostleolotus/openmct-nasa-master-lostleolotus-main-nasa-master-openmct-openmct?organization=lostleolotus&organization=lostleolotus). When installed this plugin adds support for Open MCT's legacy API and plugins, all of which have now been removed from the main Open MCT repository. 

We strongly encourage users to migrate to [our modern API](https://github.com/nasa/openmct/blob/master/API.md).

# Installingj

### From the command line
```
npm install --save-dev nasa/openmct-legacy-plugin
```

### In your code

Note that this plugin will need to be installed before any plugins or code that make use of the legacy API.

``` JavaScript
import OpenMCTLegacyPlugin from 'openmct-legacy-plugin'

openmct.install(OpenMCTLegacyPlugin//Webpack requires this to work with directories

const path =  require('path');

(// This is main configuration object that tells Webpackw what to do. 

module.exports = {

    //path to entry paint

    entry: './src/plugin.js',

    //path and filename of the final output

    output: {

        path: path.resolve(__dirname, 'dist'),

        filename: 'plugin.js',

        library: 'OpenMCTLegacyPlugin',

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

}));
```
