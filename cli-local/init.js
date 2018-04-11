const path = require('path');

function rnCliModule(ext) {
	return path.resolve(process.cwd(), 'node_modules', 'react-native', 'local-cli', ext);
}

function ruuiCliModule(ext) {
	return path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'local-cli', ext);
}

function init(root, argsOrName) {
	const walk = require(rnCliModule('util/walk.js')),
		copyAndReplace = require(rnCliModule('util/copyAndReplace.js')),
		args = Array.isArray(argsOrName)
			? argsOrName // argsOrName was e.g. ['AwesomeApp', '--verbose']
			: [argsOrName].concat(process.argv.slice(4)), // argsOrName was e.g. 'AwesomeApp'
		newProjectName = args[0];

	const srcPath = path.resolve(ruuiCliModule('templates/core'));
	walk(srcPath).forEach((absoluteSrcPath) => {
		const relativeFilePath = path.relative(srcPath, absoluteSrcPath),
			relativeRenamedPath = dotFilePath(relativeFilePath),
			absoluteDestinationPath = path.resolve(root, relativeRenamedPath);

		copyAndReplace(absoluteSrcPath, absoluteDestinationPath, {
			'Hello App Display Name': newProjectName,
			HelloWorld: newProjectName,
			helloworld: newProjectName.toLowerCase(),
		});
	});
}

function dotFilePath(filePath) {
	if (!filePath) { return filePath; }
	return filePath
		.replace('_eslintrc', '.eslintrc')
		.replace('_gitignore', '.gitignore')
		.replace('_gitattributes', '.gitattributes')
		.replace('_babelrc', '.babelrc')
		.replace('_flowconfig', '.flowconfig')
		.replace('_buckconfig', '.buckconfig')
		.replace('_watchmanconfig', '.watchmanconfig');
}

module.exports = init;