const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const chalk = require('chalk');

let brightFlag = false, initialBuild = true;
const env = process.env.ENV || 'development',
	appJsonPath = path.resolve(process.cwd(), 'app.json'),
	ruuiConfigsPath = path.resolve(process.cwd(), 'ruui.config.js'),
	port = process.env.PORT || 3000,
	isProduction = env === 'production',
	publicPath = '/',
	htmlOptions = {
		isProduction,
		publicPath,
		appName: 'ruui-app',
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

if (fs.existsSync(appJsonPath)) {
	const appInfo = require(appJsonPath);
	htmlOptions.appName = appInfo.displayName || appInfo.name || 'ruui-app';
}

if (!isProduction) {
	const cachePath = path.resolve(process.cwd(), 'web', 'vendor-manifest.json');

	optionalPlugins.push(new webpack.HotModuleReplacementPlugin());
	optionalPlugins.push(new webpack.NamedModulesPlugin());
	optionalPlugins.push(new HardSourceWebpackPlugin());

	if (fs.existsSync(cachePath)) {
		htmlOptions.useVendorChunks = true;
		optionalPlugins.push(new webpack.DllReferencePlugin({
			context: '.', manifest: require(cachePath),
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
		path: path.resolve(process.cwd(), 'web'),
		filename: isProduction ? '[name]-[hash:8].js' : '[name].js',
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
			template: path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'tools', 'index.ejs'),
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

let webpackConfigs = defaultWebpackConfigs;

function defaultConfigurator(configs) { return configs; }

if (fs.existsSync(ruuiConfigsPath)) {
	const ruuiConfigs = require(ruuiConfigsPath),
		configureWebpack = ruuiConfigs.webpack || defaultConfigurator;

	webpackConfigs = configureWebpack(defaultWebpackConfigs, webpack);
}

module.exports = webpackConfigs;