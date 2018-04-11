// const minimist = require('minimist');
//
// function getCliConfig() {
// 	const cliArgs = minimist(process.argv.slice(2));
// 	const config = cliArgs.config != null
// 		? Config.load(path.resolve(__dirname, cliArgs.config))
// 		: Config.findOptional(__dirname);
//
// 	return {...defaultRNConfig, ...config};
// }

const path = require('path');
const fs = require('fs');
