#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const prompt = require('prompt');
const semver = require('semver');

const options = require('minimist')(process.argv.slice(2));

const CLI_MODULE_PATH = function (module = 'react-native') {
	return path.resolve(process.cwd(), 'node_modules', module, 'cli.js');
};

const RN_CLI_MODULE = function (ext) {
	return path.resolve(process.cwd(), 'node_modules', 'react-native', 'local-cli', ext);
};

const PACKAGE_JSON_PATH = function (module = 'react-native') {
	return path.resolve(process.cwd(), 'node_modules', module, 'package.json');
};

if (options._.length === 0 && (options.v || options.version)) {
	printVersionsAndExit(PACKAGE_JSON_PATH('react-universal-ui'));
}

function getYarnVersionIfAvailable() {
	let yarnVersion;

	try {
		// execSync returns a Buffer -> convert to string
		if (process.platform.startsWith('win')) {
			yarnVersion = (execSync('yarn --version 2> NUL').toString() || '').trim();
		} else {
			yarnVersion = (execSync('yarn --version 2>/dev/null').toString() || '').trim();
		}
	} catch (error) {
		return null;
	}
	// yarn < 0.16 has a 'missing manifest' bug
	try {
		if (semver.gte(yarnVersion, '0.16.0')) {
			return yarnVersion;
		} else {
			return null;
		}
	} catch (error) {
		console.error(`Cannot parse yarn version: ${yarnVersion}`);
		return null;
	}
}

let cli;
const cliPath = CLI_MODULE_PATH('react-universal-ui');
if (fs.existsSync(cliPath)) {
	cli = require(cliPath);
}

const commands = options._;
if (cli) {
	cli.run();
} else {
	if (options._.length === 0 && (options.h || options.help)) {
		console.log([
			'  Usage: ruui [command] [options]',
			'',
			'  Commands:',
			'    init <ProjectName> [options]  generates a new project and installs its dependencies',
			'',
			'  Options:',
			'    -h, --help    output usage information',
			'    -v, --version use a specific version of React Universal UI',
			'    --template use an app template. Use --template to see available templates.',
			'',
		].join('\n'));
	}

	if (commands.length === 0) {
		console.error(
			'You did not pass any commands, run `ruui --help` to see a list of all available commands.');
		process.exit(1);
	}

	switch (commands[0]) {
	case 'init':
		if (!commands[1]) {
			console.error('Usage: react-native init <ProjectName> [--verbose]');
			process.exit(1);
		} else {
			init(commands[1], options);
		}
		break;
	default:
		console.error(
			'Command `%s` unrecognized. ' +
			'Make sure that you have run `npm install` and that you are inside RUUI project.',
			commands[0]);

		process.exit(1);
		break;
	}
}

function validateProjectName(name) {
	if (!String(name).match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
		console.error(
			'"%s" is not a valid name for a project. Please use a valid identifier ' +
			'name (alphanumeric).',
			name
		);
		process.exit(1);
	}

	if (name === 'React') {
		console.error(
			'"%s" is not a valid name for a project. Please do not use the ' +
			'reserved word "React".',
			name
		);
		process.exit(1);
	}
}

function init(name, opts) {
	validateProjectName(name);

	if (fs.existsSync(name)) {
		createAfterConfirmation(name, opts);
	} else {
		createProject(name, opts);
	}
}

function createAfterConfirmation(name, opts) {
	prompt.start();

	const property = {
		name: 'yesno',
		message: `Directory ${name} already exists. Continue?`,
		validator: /y[es]*|n[o]?/,
		warning: 'Must respond yes or no',
		default: 'no'
	};

	prompt.get(property, (err, result) => {
		if (result.yesno[0] === 'y') {
			createProject(name, opts);
		} else {
			console.log('Project initialization canceled');
			process.exit();
		}
	});
}

function createProject(name, opts) {
	const root = path.resolve(name);
	const projectName = path.basename(root);

	console.log('This will walk you through creating a new Ruui project in', root);

	if (!fs.existsSync(root)) {
		fs.mkdirSync(root);
	}

	const packageJson = {
		name: projectName,
		version: '0.0.1',
		private: true,
		scripts: {
			start: 'node node_modules/react-native/local-cli/cli.js start',
			ios: 'react-native run-ios',
			android: 'react-native run-android',
		}
	};
	fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson));
	process.chdir(root);

	run(root, projectName, opts);
}

function getInstallPackage(rnPackage) {
	let packageToInstall = 'react-native';
	const isValidSemver = semver.valid(rnPackage);

	if (isValidSemver) {
		packageToInstall += `@${isValidSemver}`;
	} else if (rnPackage) {
		// for tar.gz or alternative paths
		packageToInstall = rnPackage;
	}
	return packageToInstall;
}

function run(root, projectName, opts) {
	const rnPackage = opts.version; // e.g. '0.38' or '/path/to/archive.tgz'
	const forceNpmClient = opts.npm;
	const yarnVersion = (!forceNpmClient) && getYarnVersionIfAvailable();
	const extraDependencies = 'react-universal-ui react-native-web react react-dom redux react-redux';
	let installCommand;

	if (opts.installCommand) {
		// In CI environments it can be useful to provide a custom command,
		// to set up and use an offline mirror for installing dependencies, for example.
		installCommand = opts.installCommand;
	} else {
		if (yarnVersion) {
			console.log(`Using yarn v ${yarnVersion}`);
			console.log(`Installing ${getInstallPackage(rnPackage)}...`);
			installCommand = `yarn add ${extraDependencies} ${getInstallPackage(rnPackage)} --exact`;
			if (opts.verbose) {
				installCommand += ' --verbose';
			}
		} else {
			console.log(`Installing ${getInstallPackage(rnPackage)}...`);
			if (!forceNpmClient) {
				console.log('Consider installing yarn to make this faster: https://yarnpkg.com');
			}
			installCommand = `npm install --save --save-exact ${extraDependencies} ${getInstallPackage(rnPackage)}`;
			if (opts.verbose) {
				installCommand += ' --verbose';
			}
		}
	}
	try {
		execSync(installCommand, { stdio: 'inherit' });
	} catch (err) {
		console.error(err);
		console.error(`Command ${installCommand} failed.`);
		process.exit(1);
	}
	checkNodeVersion();
	const rnCli = require(CLI_MODULE_PATH()),
		ruuiCli = require(CLI_MODULE_PATH('react-universal-ui'));

	ruuiCli.init(root, projectName);
	// rnCli.init(root, projectName);
}

function checkNodeVersion() {
	const packageJson = require(PACKAGE_JSON_PATH());
	if (!packageJson.engines || !packageJson.engines.node) {
		return;
	}

	if (!semver.satisfies(process.version, packageJson.engines.node)) {
		console.error(chalk.red(
			'You are currently running Node %s but React Native requires %s. ' +
			'Please use a supported version of Node.\n' +
			'See https://facebook.github.io/react-native/docs/getting-started.html'
			),
			process.version,
			packageJson.engines.node);
	}
}

function printVersionsAndExit(ruuiPackageJsonPath) {
	console.log(`ruui-cli: ${require('./package.json').version}`);
	try {
		console.log(`react-universal-ui: ${require(ruuiPackageJsonPath).version}`);
	} catch (e) {
		console.log('react-universal-ui: n/a - not inside a React Universal UI project directory');
	}
	process.exit();
}