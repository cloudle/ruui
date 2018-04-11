const path = require('path');
const chalk = require('chalk');
const childProcess = require('child_process');
const commander = require('commander');
const commands = require('./commands/index');
const init = require('./init');
const pkg = require('../package.json');

commander.version(pkg.version);

const defaultOptParser = val => val;

const handleError = (err) => {
	console.error();
	console.error(err.message || err);
	console.error();
	process.exit(1);
};

function printUnknownCommand(cmdName) {
	console.log([
		'',
		cmdName
			? chalk.red(`  Unrecognized command '${cmdName}'`)
			: chalk.red('  You didn\'t pass any command'),
		`  Run ${chalk.cyan('ruui --help')} to see list of all available commands`,
		'',
	].join('\n'));
}

const addCommand = (command, cfg) => {
	const options = command.options || [];

	const cmd = commander
		.command(command.name, undefined, {
			noHelp: !command.description,
		})
		.description(command.description)
		.action(function () {
			const passedOptions = this.opts();
			const argv = Array.from(arguments).slice(0, -1);

			Promise.resolve()
				.then(() => {
					return command.func(argv, cfg, passedOptions);
				})
				.catch(handleError);
		});

	// cmd.helpInformation = printHelpInformation.bind(cmd);
	// cmd.examples = command.examples;
	// cmd.pkg = command.pkg;

	options
		.forEach(opt => cmd.option(
			opt.command,
			opt.description,
			opt.parse || defaultOptParser,
			typeof opt.default === 'function' ? opt.default(cfg) : opt.default,
		));

	// Placeholder option for --config, which is parsed before any other option,
	// but needs to be here to avoid "unknown option" errors when specified
	cmd.option('--config [string]', 'Path to the CLI configuration file');
};


function run() {
	commands.forEach(cmd => addCommand(cmd, {}));
	commander.parse(process.argv);

	const isValidCommand = commands.find(cmd => cmd.name.split(' ')[0] === process.argv[2]);

	if (!isValidCommand) {
		printUnknownCommand(process.argv[2]);
		return;
	}

	if (!commander.args.length) {
		commander.help();
	}
}

module.exports = { init, run, };