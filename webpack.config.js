const path = require('path');
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');

const env = process.env.ENV || 'dev';
const port = process.env.PORT || 3000;
const prod = env === 'prod';
const publicPath = `http://0.0.0.0:${port}/`;
const entry = './index.web.js';

const hot = [
	'react-hot-loader/patch',
	'webpack-dev-server/client?'+publicPath,
	'webpack/hot/only-dev-server',
];

let plugins = [
	new DefinePlugin({
		ENV: JSON.stringify(env)
	}),
	new webpack.DllReferencePlugin({
		context: '.',
		manifest: require('./web/vendor-manifest.json')
	}),
];

if (env === 'dev') {
	plugins.push(new webpack.HotModuleReplacementPlugin());
	plugins.push(new webpack.NamedModulesPlugin());
	plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = {
	cache: true,
	devtool: prod ? null : 'eval-source-map',
	entry: {
		app: prod ? [entry] : [...hot, entry]
	},
	output: {
		publicPath: publicPath,
		path: path.join(__dirname, 'web'),
		filename: '[name].bundle.js',
		chunkFilename: "[name].js"
	},
	resolve: {
		alias: {
			'react-native': 'react-native-web',
		},
		modules: ['node_modules'],
		extensions: ['.js']
	},
	plugins: plugins,
	module: {
		rules: [
			{
				test: /\.js?$/,
				loaders: prod ? ['babel-loader'] : ['react-hot-loader/webpack', 'babel-loader'],
			},
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{
				test: /\.(png|jpg|svg|ttf)$/,
				loader: 'file-loader?name=[name].[ext]'
			},
			{
				test: /\.json/,
				loader: 'json-loader'
			}
		],
	},
};