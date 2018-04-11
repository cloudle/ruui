const cliEntry = require('./cliEntry');

if (require.main === module) {
	cliEntry.run();
}

module.exports = cliEntry;