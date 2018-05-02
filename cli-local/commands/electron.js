const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const chalk = require('chalk');

function run(argv, config, args) {
	const electronPath = path.resolve(process.cwd(), 'node_modules', 'electron', 'index.js');

	if (fs.existsSync(electronPath)) {
		const electron = require(electronPath),
			child = childProcess.spawn(electron, ['-r', 'babel-register', './electron'], {
				cwd: process.cwd(),
				stdio: 'inherit',
			});

		child.on('close', function (code) {
			process.exit(code);
		});
	} else {
		console.log('Cannot locate "electron" package, please install it and try again..');
	}
}

module.exports = {
	name: 'electron',
	description: 'launch your app with Electron',
	func: run,
};
