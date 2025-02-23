const { name, version, bugs, repository } = require("../../package.json");
const { apis, auth, settings } = require("../config.json");
const { logger } = require("../utils/logger.js");
const { logErrorAndExit } = require("../utils/utils.js");
const axios = require("axios");
const gplay = require("google-play-scraper");

let firstTimeRunningRichPresence = true;

let startDate = firstTimeRunningRichPresence ? Date.now() : startDate;

const rpc = async function setActivity(client) {
	const clashofclansResponse = await axios({
		method: "GET",
		url: `${apis.clashofclans.base_url}/players/%23${settings.player.player_tag.replace("#", "")}`,
		headers: {
			"Authorization": `Bearer ${auth.clashofclans.api.token}`,
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		}
	}).catch(error => {
		if (error.response.status === 400) {
			logger.error("Client provided incorrect parameters for the request.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 403) {
			logger.error("Access denied, either because of missing/incorrect credentials or used API token does not grant access to the requested resource.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 404) {
			logger.error("Resource was not found.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 429) {
			logger.error("Request was throttled, because amount of requests was above the threshold defined for the used API token.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 500) {
			logger.error("Unknown error happened when handling the request.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else if (error.response.status === 503) {
			logger.error("Service is temporarily unavailable because of maintenance.");

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		} else {
			logger.error(`An error has occurred. Report this at ${bugs.url} !`);

			logErrorAndExit(`ERROR: ${error.response.status} - ${error.response.statusText} (${error.response.data.reason})`);
		};
	});

	const player = clashofclansResponse.data;

	const app = await gplay.app({
		appId: "com.supercell.clashofclans"
	});

	client.request("SET_ACTIVITY", {
		pid: process.pid,
		activity: {
			details: `⭐ Level: ${player.expLevel} • 🏆 Trophies: ${player.trophies}/${player.bestTrophies} • 🏆 Builder Base Trophies: ${player.builderBaseTrophies}/${player.bestBuilderBaseTrophies}`,
			state: `🏅 League: ${player.league ? player.league.name : "Unranked"} • 🏅 Builder Base League: ${player.builderBaseLeague ? player.builderBaseLeague.name : "Unranked"} • 🏠 Town Hall Level: ${player.townHallLevel} • 🏚️ Builder Hall Level: ${player.builderHallLevel}`,
			timestamps: {
				start: startDate
			},
			assets: {
				large_image: app.icon,
				large_text: app.title,
				small_image: "player",
				small_text: `${player.name} (${player.tag})`
			},
			buttons: [
				{
					label: "🚀 Download",
					url: repository.url
				}
			]
		}
	});
};

firstTimeRunningRichPresence = false;

module.exports = { rpc };