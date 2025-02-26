const { name, version, author, bugs } = require("../../package.json");
const { logger } = require("../utils/logger.js");
const { logErrorAndExit } = require("../utils/utils.js");
const chalk = require("chalk");
const axios = require("axios");

async function updateNotifier() {
	const response = await axios({
		method: "GET",
		url: `https://api.github.com/repos/${author.name}/${name}/releases/latest`,
		headers: {
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		}
	}).catch(error => {
		if (error.response.status === 404) {
			logger.error("Resource was not found.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText}`);
		} else {
			logger.error(`An error has occurred. Report this at ${bugs.url} !`);

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText}`);
		};
	});

	const release = await response.data;

	const currentVersion = version;
	const latestVersion = release.tag_name.replace("v", "");

	if (currentVersion < latestVersion) {
		console.log(chalk.white("┌───────────────────────────────────────────────────────────────────────────────────┐"));
		console.log(chalk.white("│ ") + chalk.green("🚀 A new version of ") + chalk.yellow(name) + chalk.green(" is available!") + "            " + chalk.white("│"));
		console.log(chalk.white("│") + "                                                                                   " + chalk.white("│"));
		console.log(chalk.white("│ ") + chalk.redBright(`• Current version: ${currentVersion}`) + "                                                          " + chalk.white("│"));
		console.log(chalk.white("│ ") + chalk.greenBright(`• Latest version: ${latestVersion.replace("v", "")}`) + "                                                           " + chalk.white("│"));
		console.log(chalk.white("│") + "                                                                                   " + chalk.white("│"));
		console.log(chalk.white("│ ") + chalk.blueBright(release.html_url) + " " + chalk.white("│"));
		console.log(chalk.white("└───────────────────────────────────────────────────────────────────────────────────┘"));
		console.log("\n");
	};
};

module.exports = { updateNotifier };