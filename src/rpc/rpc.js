const { name, version, repository } = require("../../package.json");
const { apis } = require("../config.json");
const { logger } = require("../utils/logger");
const axios = require("axios");
const { app } = require("google-play-scraper");

let firstTimeRunningRichPresence = true;

let startDate = firstTimeRunningRichPresence
	? Date.now()
	: startDate;

const rpc = async function setActivity(client) {
	const clashofclansResponse = await axios({
		method: "GET",
		url: `${apis.clashofclans.base_url}/v1/players/%23${process.env.CLASH_OF_CLANS_PLAYER_TAG.replace("#", "")}`,
		headers: {
			"Authorization": `Bearer ${process.env.CLASH_OF_CLANS_API_KEY}`,
			"Content-Type": "application/json",
			"User-Agent": `${name}/${version}`
		}
	}).catch((error) => {
		logger.error(error);

		return;
	});

	const player = clashofclansResponse.data;

	const gameApp = await app({
		appId: "com.supercell.clashofclans"
	});

	client.request("SET_ACTIVITY", {
		pid: process.pid,
		activity: {
			details: `⭐ Level: ${player.expLevel} • 🏆 Trophies: ${player.trophies}/${player.bestTrophies} • 🏆 Builder Base Trophies: ${player.builderBaseTrophies}/${player.bestBuilderBaseTrophies}`,
			state: `🏅 League: ${player.leagueTier.name.replace("League", "")} • 🏅 Builder Base League: ${player.builderBaseLeague ? player.builderBaseLeague.name.replace("League", "") : "Unranked"} • 🏠 Town Hall Level: ${player.townHallLevel} • 🏚️ Builder Hall Level: ${player.builderHallLevel ? player.builderHallLevel : "1"}`,
			timestamps: {
				start: startDate
			},
			assets: {
				large_image: gameApp.icon,
				large_text: gameApp.title,
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