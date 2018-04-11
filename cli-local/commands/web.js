const path = require('path');
const childProcess = require('child_process');

function run() {
	const root = process.cwd(),
		devServer = require(path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'tools', 'webpack.devserver.js'));

	devServer.listen(3000, 'localhost', (err, result) => {
		if (err) console.log(err);
		return true;
	});
}

module.exports = {
	name: 'run-web',
	description: 'run your app in Browser',
	func: run,
};