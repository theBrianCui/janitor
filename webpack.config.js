const path = require('path');

module.exports = {
    entry: {
        'content_scripts/bundle': path.resolve(__dirname, 'src/content_scripts/main.js'),
        'popup/bundle': path.resolve(__dirname, 'src/popup/popup.js'),
        'background/bundle': path.resolve(__dirname, 'src/background/background.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    // module: {
    //     rules: [
    //         // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
    //         { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

    //         // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
    //         { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    //     ]
    // },
};