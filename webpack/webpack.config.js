const path = require('path');
const webpack = require('webpack')
const externals = require('webpack-node-externals')

module.exports = {
    mode: "production",
    target: "node",
    entry: {
        api: path.resolve(__dirname, '..', 'src', 'api.class.js'),
        web: path.resolve(__dirname, '..', 'src', 'web.class.js'),
    },
    output: {
        path: path.resolve(__dirname, '..', 'build'),
        filename: "[name].bundle.js"
    },
    externals: [
        externals()
    ]
}