module.exports = {
	webpack: (configs) => {
		configs.target = 'electron-renderer';
		return configs;
	}
};
