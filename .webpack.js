const path = require('path');
const externals = require('webpack-node-externals');

module.exports = {
	mode: 'production',
	target: 'node',
	entry: {
		api: path.resolve(__dirname, 'src', 'api.server.js'),
		web: path.resolve(__dirname, 'src', 'web.server.js'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js',
	},
	externals: [externals()],
	module: {},
	plugins: [],
};
