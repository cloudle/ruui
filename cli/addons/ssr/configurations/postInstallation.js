const fs = require('fs');

fs.readFile('./configurations/reactNavigationStack.js', (err, data) => {
	const content = data.toString();

	fs.writeFile('./node_modules/@react-navigation/stack/lib/commonjs/index.js', content, 'utf8', (err) => {
		if (err) {
			console.log('patch @react-navigation/stack failed', err);
		} else {
			console.log('Successfully patched @react-navigation/stack (for server-side-rendering)');
		}
	});
});
