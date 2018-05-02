const path = require('path');
const init = require('../init');

module.exports = [
	require('./web'),
	require('./electron'),
	require('./cache'),
	require('./bundle'),
	{
		name: 'init',
		func: () => {
			console.log([
				"Looks like we're already in a React Universal UI project folder",
				'We should run this command from a different folder instead..',
			].join('\n'));
			// init(path.resolve('./'), 'SuperAwesomeProject', {
			// 	_: ['init', 'SuperAwesomeProject'],
			// 	'ruui-template': 'electron',
			// });
		},
	},
];
