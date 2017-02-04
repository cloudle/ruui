const path = require('path');
const webpack = require('webpack');

const devVendors = [
	'react-hot-loader',
	'sockjs-client',
	'url', 'strip-ansi', 'ansi-regex',
];

module.exports = {
	entry: {
		'vendor': [
			'babel-polyfill',
			'react', 'react-dom',
			'react-native-web',
			'react-router', 'react-router-addons-controlled', 'history',
			'react-native-vector-icons/FontAwesome',
			'react-native-vector-icons/Ionicons',
			'react-native-vector-icons/glyphmaps/MaterialIcons.json',
			'tinycolor2', 'lodash',
			...devVendors,
		],
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
				loaders: ['babel-loader'],
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

	output: {
		filename: '[name].bundle.js',
		path: path.join(__dirname, 'web'),
		library: '[name]_lib',
	},

	plugins: [
		new webpack.DllPlugin({
			path: path.join(__dirname, 'web/[name]-manifest.json'),
			name: '[name]_lib'
		}),
	],
};