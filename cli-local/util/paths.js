const fs = require('fs');
const path = require('path');

module.exports = {
	ruui: path.resolve(process.cwd(), 'web'),
	ruuiConfig: path.resolve(process.cwd(), 'ruui.config.js'),
	packageJson: path.resolve(process.cwd(), 'package.json'),
	ruuiJson: path.resolve(process.cwd(), 'web', 'ruui.json'),
	appJson: path.resolve(process.cwd(), 'app.json'),
	web: path.resolve(process.cwd(), 'web'),
	cache: path.resolve(process.cwd(), 'web', 'vendor-manifest.json'),
	getEnv: name => path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'env', `${name}.env`),
	getEjsTemplate: () => {
		const manualEjsPath = path.resolve(process.cwd(), 'index.ejs'),
			defaultEjsPath = path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'tools', 'index.ejs');

		return fs.existsSync(manualEjsPath) ? manualEjsPath : defaultEjsPath;
	},
};
