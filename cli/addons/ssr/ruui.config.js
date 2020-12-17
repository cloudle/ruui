const env = () => process.env.ENV || 'development';
const alias = require('./configurations/moduleAliases');

module.exports = {
	env,
	publicPath: (env) => {
		return env === 'production' ? '/' : 'http://localhost:3000/';
	},
	webpack: (configs) => {
		require('./configurations/postInstallation');
		/* <- remove above line and put following under package.json scripts {
		**  "postinstall": "node configurations/postInstallation.js"
		* } */

		Object.assign(configs.resolve.alias, alias.shared, alias.browser);

		return configs;
	},
};
