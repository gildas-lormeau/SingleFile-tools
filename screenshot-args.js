/* global require, module */

const args = require("yargs")
	.wrap(null)
	.command("$0 <output> [url]", "Save a full screenshot of a web page", yargs => {
		yargs.positional("output", { description: "file name", type: "string" });
		yargs.positional("url", { description: "URL", type: "string" });
	})
	.default({
		"browser-block-ads": true,
		"browser-disable-cookies": true,
		"browser-executable-path": undefined,
		"browser-headless": true,
		"browser-language": "en-US,en;q=0.9",
		"browser-user-agent": "Mozilla/5.0 AppleWebKit (KHTML, like Gecko) Chrome Safari",
		"viewport-height": 1080,
		"viewport-width": 1920,
		"page-idle-wait-enabled": true,
		"page-idle-timeout": 5000,
		"page-idle-detection-accuracy": .99,
		"page-load-timeout": 0,
		"page-load-wait-until": "networkidle2",
		"page-termination-timeout": 150000,
		"stdin-charset": "utf-8"
	})
	.string("browser-executable-path")
	.boolean("browser-block-ads")
	.boolean("browser-disable-cookies")
	.boolean("browser-headless")
	.boolean("page-idle-wait-enabled")
	.argv;

delete args["$0"];
delete args["_"];
args.browserOptions = {
	disableCookies: args.browserDisableCookies,
	executablePath: args.browserExecutablePath,
	headless: args.browserHeadless,
	language: args.browserLanguage,
	userAgent: args.browserUserAgent,
	blockAds: args.browserBlockAds
};
args.pageLoadOptions = {
	timeout: args.pageLoadTimeout,
	waitUntil: args.pageLoadWaitUntil
};
args.screenshotOptions = {	
	idleTimeout: args.pageIdleTimeout,
	idleDetectionAccuracy: args.pageIdleDetectionAccuracy,
	idleWaitEnabled: args.pageIdleWaitEnabled,
	terminationTimeout: args.pageTerminationTimeout,
	path: args.output
};
args.viewPortOptions = {
	width: args.viewportWidth,
	height: args.viewportHeight,
};
delete args.browserDisableCookies;
delete args.browserExecutablePath;
delete args.browserHeadless;
delete args.browserLanguage;
delete args.browserUserAgent;
delete args.browserBlockAds;
delete args.pageLoadTimeout;
delete args.pageLoadWaitUntil;
delete args.pageIdleTimeout;
delete args.pageIdleDetectionAccuracy;
delete args.pageIdleWaitEnabled;
delete args.pageTerminationTimeout;
delete args.viewportWidth;
delete args.viewportHeight;
module.exports = args;