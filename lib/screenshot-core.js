/* global exports, require, setTimeout, clearTimeout, performance, document */

const { PuppeteerBlocker } = require("@cliqz/adblocker-puppeteer");
const fetch = require("cross-fetch");

const DEFAULT_OPTIONS = {
	idleTimeout: 5000,
	idleDetectionAccuracy: .99,
	idleWaitEnabled: true,
	terminationTimeout: 150000,
	fullPage: true,
	omitBackground: true
};
const DEFAULT_BROWSER_OPTIONS = {
	blockAds: true,
	headless: true,
	args: ["--font-render-hinting=none", "--no-pings"]
};
const DEFAULT_VIEWPORT_OPTIONS = { width: 1920, height: 1080 };
const DEFAULT_LANGUAGE = "en-US,en;q=0.9";
const DEFAULT_USER_AGENT = "Mozilla/5.0 AppleWebKit (KHTML, like Gecko) Chrome Safari";
const HEADER_NAME_ACCEPT_LANGUAGE = "accept-language";

const DEVTOOLS_COMMAND_GET_LAYOUT_METRICS = "Page.getLayoutMetrics";

exports.preparePage = async (page, options) => {
	options.viewportOptions = Object.assign({}, DEFAULT_VIEWPORT_OPTIONS, options.viewportOptions);
	options.browserOptions = Object.assign({}, DEFAULT_BROWSER_OPTIONS, options.browserOptions);
	if (options.browserOptions.proxyServer) {
		options.browserOptions.args.push("--proxy-server=" + options.browserOptions.proxyServer);
	}
	const httpHeaders = Object.assign({ [HEADER_NAME_ACCEPT_LANGUAGE]: options.browserOptions.language || DEFAULT_LANGUAGE }, options.browserOptions.headers);
	await page.setExtraHTTPHeaders(httpHeaders);
	await page.setUserAgent(options.browserOptions.userAgent || DEFAULT_USER_AGENT);
	await page.setViewport(options.viewportOptions);
	if (options.browserOptions.disableCookies) {
		page.evaluateOnNewDocument(() => {
			document.__defineGetter__("cookie", () => "");
			document.__defineSetter__("cookie", () => "");
		});
	}
	if (options.browserOptions.blockAds) {
		const blocker = await PuppeteerBlocker.fromPrebuiltAdsAndTracking(fetch);
		blocker.enableBlockingInPage(page);
	}
};

exports.resizeViewPort = async function resizeViewPort(page, options) {
	const client = await page.target().createCDPSession();
	const pageSize = (await client.send(DEVTOOLS_COMMAND_GET_LAYOUT_METRICS)).contentSize;
	await client.detach();
	const width = Math.ceil(pageSize.width);
	const height = Math.ceil(Math.max(pageSize.height - (options.viewportOptions.height / 2), options.viewportOptions.height));
	await page.setViewport({ width, height });
};

exports.screenshot = async (page, options) => {
	let terminationTimeout, performanceEntries = [];
	const screenshotOptions = Object.assign({}, DEFAULT_OPTIONS, options.screenshotOptions);
	if (screenshotOptions.idleWaitEnabled) {
		await Promise.race([
			new Promise(resolve => terminationTimeout = setTimeout(resolve, screenshotOptions.terminationTimeout)),
			waitUntilPageLoad()]);
	}
	return {
		screenshot: await page.screenshot(screenshotOptions),
		performanceEntries
	};

	function waitUntilPageLoad() {
		let lastProgressValue = 0, maybeIdle;
		return new Promise((resolve, reject) => checkProgress({ resolve, reject }));

		async function checkProgress({ resolve, reject }) {
			try {
				performanceEntries = JSON.parse(await page.evaluate(() => JSON.stringify(performance.getEntries())));
				if (lastProgressValue < performanceEntries.length * screenshotOptions.idleDetectionAccuracy) {
					maybeIdle = false;
					setTimeout(checkProgress, screenshotOptions.idleTimeout, { resolve, reject });
				} else if (!maybeIdle) {
					maybeIdle = true;
					setTimeout(checkProgress, screenshotOptions.idleTimeout, { resolve, reject });
				} else {
					clearTimeout(terminationTimeout);
					resolve();
				}
				lastProgressValue = performanceEntries.length;
			} catch (error) {
				clearTimeout(terminationTimeout);
				reject(error);
			}
		}
	}
};