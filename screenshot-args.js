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
		"browser-header": [],
		"browser-headless": true,
		"browser-language": "en-US,en;q=0.9",
		"browser-proxy-server": undefined,
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
	.array("browser-header")
	.boolean("browser-headless")
	.string("browser-proxy-server")
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
	blockAds: args.browserBlockAds,
	proxyServer: args.browserProxyServer,
	headers: {}
};
args.browserHeader.forEach(header => {
	const matchedHeader = header.match(/^(.*?):(.*)$/);
	if (matchedHeader.length == 3) {
		args.browserOptions.headers[matchedHeader[1].trim().toLowerCase()] = matchedHeader[2].trimLeft();
	}
});
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
delete args.browserHeader;
delete args.browserHeadless;
delete args.browserLanguage;
delete args.browserProxyServer;
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