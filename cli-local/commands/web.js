const path = require('path');
const childProcess = require('child_process');
const chalk = require('chalk');

const port = process.env.ENV || 3000;

function run() {
	const root = process.cwd();

	console.log('Preparing super awesome dev-server at', chalk.whiteBright(`localhost:${port}`), ':p');

	setTimeout(() => {
		const devServer = require('../tools/webpack.devserver');

		devServer.listen(3000, 'localhost', (err, result) => {
			if (err) console.log(err);
			return true;
		});
	}, 0);
}

module.exports = {
	name: 'dev',
	description: 'run your app in Browser',
	func: run,
};