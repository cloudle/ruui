const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const chalk = require('chalk');

function run(argv, config, args) {
	const electronCliPath = path.resolve(process.cwd(), 'node_modules', 'electron', 'cli.js');

	if (fs.existsSync(electronCliPath)) {
		childProcess.spawn('electron', ['-r', 'babel-register', './electron']);
	} else {
		console.log('Cannot locate "electron" package, please install it and try again..');
	}
}

module.exports = {
	name: 'electron',
	description: 'launch your app with Electron',
	func: run,
};
