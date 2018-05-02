const fs = require('fs'),
	paths = require('../util/paths');

let appJson = {},
	ruuiConfigs = {};

if (fs.existsSync(paths.appJson)) appJson = require(paths.appJson);
if (fs.existsSync(paths.ruuiConfig)) ruuiConfigs = require(paths.ruuiConfig);

module.exports = {
	appJson,
	ruui: ruuiConfigs,
};
