const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const templateExclustions = ['dependencies.json', 'devDependencies.json', ];
const rnCliModule = ext => path.resolve(process.cwd(), 'node_modules', 'react-native', 'local-cli', ext);
const ruuiCliModule = ext => path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', ext);
const isDirectory = source => fs.lstatSync(source).isDirectory();

const getDirectories = source => fs.readdirSync(source)
	.map(name => path.join(source, name))
	.filter(isDirectory);

function init(root, argsOrName, opts) {
	const template = opts['ruui-template'],
		availableTemplates = getDirectories(path.resolve(ruuiCliModule('templates')))
			.map(source => path.relative(ruuiCliModule('templates'), source))
			.filter(name => name !== 'core'),
		walk = require(rnCliModule('util/walk')),
		copyAndReplace = require(rnCliModule('util/copyAndReplace')),
		yarn = require(rnCliModule('util/yarn')),
		yarnVersion = (!opts.npm) &&
			yarn.getYarnVersionIfAvailable() &&
			yarn.isGlobalCliUsingYarn(root),
		templates = require('./util/templates'),
		args = Array.isArray(argsOrName)
			? argsOrName // argsOrName was e.g. ['AwesomeApp', '--verbose']
			: [argsOrName].concat(process.argv.slice(4)), // argsOrName was e.g. 'AwesomeApp';
		newProjectName = args[0],
		templateReplacements = {
			'Hello App Display Name': newProjectName,
			HelloWorld: newProjectName,
			helloworld: newProjectName.toLowerCase(),
		};

	const coreTemplatePath = path.resolve(ruuiCliModule('templates/core'));
	walk(coreTemplatePath).forEach((absoluteSrcPath) => {
		const relativeFilePath = path.relative(coreTemplatePath, absoluteSrcPath),
			relativeRenamedPath = dotFilePath(relativeFilePath),
			absoluteDestinationPath = path.resolve(root, relativeRenamedPath);

		if (templateExclustions.indexOf(relativeRenamedPath) >= 0) return;
		copyAndReplace(absoluteSrcPath, absoluteDestinationPath, templateReplacements);
	});

	templates.installTemplateDependencies(coreTemplatePath, yarnVersion);
	templates.installTemplateDevDependencies(coreTemplatePath, yarnVersion);

	if (template) {
		if (availableTemplates.indexOf(template) >= 0) {
			const childTemplatePath = path.resolve(ruuiCliModule(`templates/${template}`));

			walk(childTemplatePath).forEach((absoluteSrcPath) => {
				const relativeFilePath = path.relative(childTemplatePath, absoluteSrcPath),
					relativeRenamedPath = dotFilePath(relativeFilePath),
					absoluteDestinationPath = path.resolve(root, relativeRenamedPath);

				if (templateExclustions.indexOf(relativeRenamedPath) >= 0) return;
				copyAndReplace(absoluteSrcPath, absoluteDestinationPath, templateReplacements);
			});

			templates.installTemplateDependencies(childTemplatePath, yarnVersion);
			templates.installTemplateDevDependencies(childTemplatePath, yarnVersion);
		} else {
			console.log(chalk.yellow(`Couldn't found template with name "${template}". The project currently use default (essential) template!`));
		}
	}
}

function dotFilePath(filePath) {
	if (!filePath) { return filePath; }
	return filePath
		.replace('_eslintrc', '.eslintrc')
		.replace('_gitignore', '.gitignore')
		.replace('_gitattributes', '.gitattributes')
		.replace('_babelrc', '.babelrc')
		.replace('_flowconfig', '.flowconfig')
		.replace('_buckconfig', '.buckconfig')
		.replace('_watchmanconfig', '.watchmanconfig');
}

module.exports = init;
