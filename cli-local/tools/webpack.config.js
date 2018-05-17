const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const uuid = require('uuid');
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const chalk = require('chalk');
const paths = require('../util/paths');
const configs = require('../util/configs');

let brightFlag = false, initialBuild = true;

const env = process.env.ENV || 'development',
	analyzeMode = process.env.ANALYZE === 'true',
	port = process.env.PORT || 3000,
	isProduction = env === 'production',
	publicPath = configs.ruui.publicPath || '/',
	htmlOptions = {
		isProduction,
		publicPath,
		appName: configs.appJson.displayName || configs.appJson.name || 'ruui-app',
		useVendorChunks: false
	},
	uniqueId = configs.ruui.buildId || uuid.v4,
	buildId = uniqueId(),
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
	optionalPlugins.push(new HardSourceWebpackPlugin());

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
		console.log(chalk.black('｢ruui｣'), chalk.gray('not using ') + chalk.green('cache') +
			chalk.gray(', run ') + chalk.magenta('ruui cache') + chalk.gray(' once to boost up build speed..'));
	}
} else {
	const lastBuildPath = path.resolve(paths.ruui, `${configs.ruuiJson.buildId}.js`),
		keepPreviousBuild = configs.ruui.keepPreviousBuild;

	if (!keepPreviousBuild && configs.ruuiJson.buildId && fs.existsSync(lastBuildPath)) {
		fs.unlinkSync(lastBuildPath);
	}

	mkdirp.sync(paths.ruui);
	fs.writeFileSync(paths.ruuiJson, JSON.stringify({
		...configs.ruuiJson,
		buildId,
	}, null, 2));
}

const defaultWebpackConfigs = {
	context: process.cwd(),
	mode: isProduction ? 'production' : 'development',
	cache: true,
	entry: {
		app: isProduction ? [...polyfills, ...entries] : [...polyfills, ...hot, ...entries]
	},
	optimization: {
		minimize: isProduction,
	},
	output: {
		publicPath,
		path: paths.web,
		filename: isProduction ? `${buildId}.js` : '[name].js',
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
			width: 32, complete: chalk.black('░'), incomplete: chalk.gray('░'),
			format: 'building ⸨:bar⸩ (:elapsed seconds)',
			summary: false, customSummary: (buildTime) => {
				const alternatedColor = brightFlag ? chalk.black : chalk.gray,
					ruuiBullet = `${chalk.black('｢')}${alternatedColor('ruui')}${chalk.black('｣')}`,
					buildType = initialBuild ? 'initial build' : 'hot rebuild',
					buildFlag = isProduction ? 'production bundle' : buildType,
					trailingSpace = initialBuild ? '' : '  ';

				console.log(ruuiBullet, chalk.gray(`${buildFlag} completed after${trailingSpace}`), chalk.black(`${buildTime}`));
				brightFlag = !brightFlag;
				initialBuild = false;
			},
		}),
		...optionalPlugins,
	]
};

function defaultConfigurator(baseConfig) { return baseConfig; }
const configureWebpack = configs.ruui.webpack || defaultConfigurator;

module.exports = configureWebpack(defaultWebpackConfigs, webpack);
