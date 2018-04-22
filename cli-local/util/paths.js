const fs = require('fs');
const paths = require('path');

module.exports = {
	ruui: paths.resolve(process.cwd(), 'node_modules', '.ruui'),
	packageJson: paths.resolve(process.cwd(), 'package.json'),
	previousPackageJson: paths.resolve(process.cwd(), 'node_modules', '.ruui', 'previousPackage.json'),
	cache: paths.resolve(process.cwd(), 'web', 'vendor-manifest.json'),
	getEnv: name => paths.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'env', `${name}.env`),
};
