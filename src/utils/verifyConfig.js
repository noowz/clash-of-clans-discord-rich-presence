const { logErrorAndExit } = require("./utils.js");

const CLIENT_ID = "848194055619215360";

async function verifyConfig() {
	if (!process.env.NODE_ENV) {
		logErrorAndExit("No development environment provided. Please update the 'NODE_ENV' field in the environment variable file with 'development', 'production', or 'test'.");
	};

	if (!process.env.DISCORD_CLIENT_ID) {
		logErrorAndExit("No Discord Rich Presence client ID provided. Please update the 'DISCORD_CLIENT_ID' field in the environment variable file with your Discord Rich Presence client ID.");
	} else if (!process.env.DISCORD_CLIENT_ID.match(/\d/)) {
		logErrorAndExit("The provided Discord Rich Presence client ID is invalid. Ensure the 'DISCORD_CLIENT_ID' field in the environment variable file contains a valid numeric ID.");
	} else if (!process.env.DISCORD_CLIENT_ID.match(CLIENT_ID)) {
		logErrorAndExit(`The provided Discord Rich Presence client ID does not match the required client ID. Update the 'DISCORD_CLIENT_ID' field in the environment variable file to ${CLIENT_ID}.`);
	};

	if (!process.env.CLASH_OF_CLANS_API_KEY) {
		logErrorAndExit("No Clash of Clans API key provided. Please update the 'CLASH_OF_CLANS_API_KEY' field in the environment variable file with your Clash of Clans API key.");
	};

	if (!process.env.CLASH_OF_CLANS_PLAYER_TAG) {
		logErrorAndExit("No Clash of Clans player tag provided. Please update the 'CLASH_OF_CLANS_PLAYER_TAG' field in the environment variable file with your Clash of Clans player tag.");
	};
};

module.exports = { verifyConfig };