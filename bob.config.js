const cliBuild = process.env.BUILD === 'cli';

module.exports = {
	source: cliBuild ? 'js' : 'src',
	output: cliBuild ? 'lib-cli' : 'lib',
	targets: [
		'commonjs',
		'module',
	]
};
