const path = require('path');
const childProcess = require('child_process');

function run() {
	const root = process.cwd(),
		runDevServer = require(path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'tools', 'webpack.devserver.js'));
	console.log(root);
	// runDevServer();
}

module.exports = {
	name: 'web',
	description: 'run your app in Browser',
	func: run,
};