const path = require('path');
const childProcess = require('child_process');

function run() {
	console.log('bundling..');
}

module.exports = {
	name: 'vendor',
	description: 'bundle common chunks that boost up rebuild speed!',
	func: run,
};