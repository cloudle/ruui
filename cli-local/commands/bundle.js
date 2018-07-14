const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const dotenv = require('dotenv');
const configs = require('../util/configs');
const paths = require('../util/paths');

function run() {
	console.log('Bundling project to production release...');
	dotenv.config({ path: path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'env', 'prod.env') });

	setTimeout(() => {
		const baseConfigs = require('../tools/webpack.config'),
			compiler = webpack(baseConfigs);

		compiler.run((error, stats) => {
			if (error) {
				console.log(error);
			} else {
				const previousBuildId = configs.ruuiJson.buildId,
					lastBuildPath = path.resolve(paths.ruui, `${previousBuildId}.js`),
					keepBuild = configs.ruui.keepPreviousBuild;

				/* clean up previous build if possible */
				if (!keepBuild && configs.ruuiJson.buildId && fs.existsSync(lastBuildPath)) {
					console.log(chalk.gray(`clean up previous build, deleted web/${previousBuildId}.js`));
					fs.unlinkSync(lastBuildPath);
				}
			}
		});
	}, 0);
}

module.exports = {
	name: 'bundle',
	description: 'bundle ruui project to production output',
	func: run,
};
