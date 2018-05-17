const fs = require('fs'),
	paths = require('../util/paths');

let appJson = {},
	ruuiJson = {},
	ruuiConfigs = {};

if (fs.existsSync(paths.appJson)) appJson = require(paths.appJson);
if (fs.existsSync(paths.ruuiJson)) ruuiJson = require(paths.ruuiJson);
if (fs.existsSync(paths.ruuiConfig)) ruuiConfigs = require(paths.ruuiConfig);

module.exports = {
	appJson,
	ruuiJson,
	ruui: ruuiConfigs,
};
