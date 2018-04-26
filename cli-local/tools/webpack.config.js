const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const chalk = require('chalk');
const paths = require('../util/paths');

let brightFlag = false,
	initialBuild = true,
	appJson = {},
	ruuiConfigs = {};

if (fs.existsSync(paths.appJson)) appJson = require(paths.appJson);
if (fs.existsSync(paths.ruuiConfig)) ruuiConfigs = require(paths.ruuiConfig);

const env = process.env.ENV || 'development',
	analyzeMode = process.env.ANALYZE === 'true',
	port = process.env.PORT || 3000,
	isProduction = env === 'production',
	publicPath = ruuiConfigs.publicPath || '/',
	htmlOptions = {
		isProduction,
		publicPath,
		appName: appJson.displayName || appJson.name || 'ruui-app',
		useVendorChunks: false
	},
	optionalPlugins = [],
	polyfills = ['babel-polyfill'],
	entries = ['./index.web.js'],
	hot = [
		'react-hot-loader/patch',
		`webpack-dev-server/client?${publicPath}`,
		'webpack/hot/only-dev-server',
	];

if (!isProduction) {
	optionalPlugins.push(new webpack.HotModuleReplacementPlugin());
	optionalPlugins.push(new webpack.NamedModulesPlugin());
	// optionalPlugins.push(new HardSourceWebpackPlugin());

	if (analyzeMode) {
		optionalPlugins.push(new BundleAnalyzerPlugin());
	}

	if (fs.existsSync(paths.cache)) {
		htmlOptions.useVendorChunks = true;
		optionalPlugins.push(new webpack.DllReferencePlugin({
			context: '.', manifest: require(paths.cache),
		}));
	}

	if (!htmlOptions.useVendorChunks) {
		console.log(chalk.whiteBright('｢ruui｣'), chalk.gray('not using ') + chalk.green('cache') +
			chalk.gray(', run ') + chalk.magenta('ruui cache') + chalk.gray(' once to boost up build speed..'));
	}
}

const defaultWebpackConfigs = {
	context: process.cwd(),
	cache: true, mode: 'development',
	entry: {
		app: isProduction ? [...polyfills, ...entries] : [...polyfills, ...hot, ...entries]
	},
	optimization: {
		minimize: isProduction,
	},
	output: {
		publicPath,
		path: paths.web,
		filename: isProduction ? '[name]-[hash:8].js' : '[name].js',
		chunkFilename: '[name].js',
	},
	resolve: {
		mainFields: ['browser', 'main', 'module'],
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
					plugins: ['react-hot-loader/babel']
				}
			},
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			{
				test: /\.(png|jpg|svg|ttf)$/,
				loader: 'file-loader?name=[name].[ext]'
			}
		],
	},
	plugins: [
		new DefinePlugin({
			ENV: JSON.stringify(env),
			'process.env.NODE_ENV': JSON.stringify(env),
		}),
		new HtmlWebpackPlugin({
			...htmlOptions,
			template: paths.getEjsTemplate(),
			filename: 'index.html',
		}),
		new ProgressBarPlugin({
			width: 32, complete: chalk.whiteBright('░'), incomplete: chalk.gray('░'),
			format: 'building ⸨:bar⸩ (:elapsed seconds)',
			summary: false, customSummary: (buildTime) => {
				const alternatedColor = brightFlag ? chalk.whiteBright : chalk.gray,
					ruuiBullet = `${chalk.whiteBright('｢')}${alternatedColor('ruui')}${chalk.whiteBright('｣')}`,
					buildType = initialBuild ? 'initial build' : 'hot rebuild',
					buildFlag = isProduction ? 'production bundle' : buildType,
					trailingSpace = initialBuild ? '' : '  ';

				console.log(ruuiBullet, chalk.gray(`${buildFlag} completed after${trailingSpace}`), chalk.whiteBright(`${buildTime}`));
				brightFlag = !brightFlag;
				initialBuild = false;
			},
		}),
		...optionalPlugins,
	]
};

function defaultConfigurator(configs) { return configs; }
const configureWebpack = ruuiConfigs.webpack || defaultConfigurator;

module.exports = configureWebpack(defaultWebpackConfigs, webpack);
