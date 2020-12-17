const { resolve, } = require('path');

const isProduction = process.env.ENV === 'production';
const src = isProduction ? 'dist' : 'src';

module.exports = {
	shared: {
		'react-native-linear-gradient': 'react-native-web-linear-gradient',
		'react-native-iphone-x-helper': resolve(process.cwd(), `${src}/compatible/x-helper.js`),
	},
	browser: {

	},
	node: {
		'react-native': 'react-native-web',
		'react-native-svg': resolve(process.cwd(), 'node_modules/react-native-svg/lib/commonjs/ReactNativeSVG.web.js'),
	},
};
