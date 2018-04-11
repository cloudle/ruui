console.log(process.cwd(), '<<<');

const path = require('path');
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const colors = require('colors');

const env = process.env.ENV || 'dev',
	port = process.env.PORT || 3000,
	isProduction = env === 'production',
	publicPath = '/',
	htmlOptions = { isProduction, publicPath, useVendorChunks: false },
	optionalPlugins = [],
	polyfills = ['babel-polyfill'],
	entry = ['./index.web.js'],
	hot = [
		'react-hot-loader/patch',
		`webpack-dev-server/client?${publicPath}`,
		'webpack/hot/only-dev-server',
	];

if (!isProduction) {
	optionalPlugins.push(new webpack.HotModuleReplacementPlugin());
	optionalPlugins.push(new webpack.NamedModulesPlugin());
	optionalPlugins.push(new webpack.NoEmitOnErrorsPlugin());

	if (require('fs').existsSync('./web/vendor-manifest.json')) {
		htmlOptions.useVendorChunks = true;
		optionalPlugins.push(new webpack.DllReferencePlugin({
			context: '.', manifest: require('./web/vendor-manifest.json'),
		}));
	}

	if (!htmlOptions.useVendorChunks) {
		console.log('(serving without '.grey + 'common-library-cache'.green +
			', run '.grey + 'yarn vendor'.magenta + ' once to boost up build speed)'.grey);
	}

	optionalPlugins.push(new ProgressBarPlugin({
		width: 39, complete: '▓'.green.bgGreen, incomplete: ' '.green.bgWhite,
		format: 'Build (:bar) (:elapsed seconds)',
		summary: false, customSummary: (buildTime) => {
			console.log('Build completed after', ` ${buildTime} `.bgGreen);
		},
	}));
}

module.exports = {
	cache: true,
	devtool: isProduction ? false : 'eval-source-map',
	entry: {
		app: isProduction ? [...polyfills, ...entry] : [...polyfills, ...hot, ...entry]
	},
	output: {
		publicPath, path: path.join(__dirname, 'web'),
		filename: '[name].bundle-[hash].js',
		chunkFilename: '[name].js',
	},
	resolve: {
		alias: {
			'react-native': 'react-native-web',
		},
		modules: ['node_modules'],
		extensions: ['.js']
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
					plugins: ['react-hot-loader/babel', ]
				}
			},
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
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
	plugins: [
		new DefinePlugin({
			ENV: JSON.stringify(env),
			'process.env.NODE_ENV': JSON.stringify(env),
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new HtmlWebpackPlugin({
			...htmlOptions,
			template: 'index.ejs',
			filename: 'index.html',
		}),
		...optionalPlugins,
	]
};