const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

function installTemplateDependencies(templatePath, yarnVersion) {
	// dependencies.json is a special file that lists additional dependencies
	// that are required by this template
	const dependenciesJsonPath = path.resolve(templatePath, 'dependencies.json');
	console.log('Adding dependencies for the project...');
	if (!fs.existsSync(dependenciesJsonPath)) {
		console.log('No additional dependencies.');
		return;
	}

	let dependencies;
	try {
		dependencies = JSON.parse(fs.readFileSync(dependenciesJsonPath));
	} catch (err) {
		throw new Error('Could not parse the template\'s dependencies.json: ' + err.message);
	}
	for (let depName in dependencies) {
		const depVersion = dependencies[depName];
		const depToInstall = depName + '@' + depVersion;
		console.log('Adding ' + depToInstall + '...');
		if (yarnVersion) {
			execSync(`yarn add ${depToInstall}`, {stdio: 'inherit'});
		} else {
			execSync(`npm install ${depToInstall} --save --save-exact`, {stdio: 'inherit'});
		}
	}
}

function installTemplateDevDependencies(templatePath, yarnVersion) {
	// devDependencies.json is a special file that lists additional develop dependencies
	// that are required by this template
	const devDependenciesJsonPath = path.resolve(templatePath, 'devDependencies.json');
	console.log('Adding develop dependencies for the project...');
	if (!fs.existsSync(devDependenciesJsonPath)) {
		console.log('No additional develop dependencies.');
		return;
	}

	let dependencies;
	try {
		dependencies = JSON.parse(fs.readFileSync(devDependenciesJsonPath));
	} catch (err) {
		throw new Error('Could not parse the template\'s devDependencies.json: ' + err.message);
	}
	for (let depName in dependencies) {
		const depVersion = dependencies[depName];
		const depToInstall = depName + '@' + depVersion;
		console.log('Adding ' + depToInstall + '...');
		if (yarnVersion) {
			execSync(`yarn add ${depToInstall} -D`, {stdio: 'inherit'});
		} else {
			execSync(`npm install ${depToInstall} --save-dev --save-exact`, {stdio: 'inherit'});
		}
	}
}

module.exports = {
	installTemplateDependencies,
	installTemplateDevDependencies,
};
