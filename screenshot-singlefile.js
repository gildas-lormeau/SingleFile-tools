#!/usr/bin/env node

/* global require */

const { screenshot, preparePage } = require("./lib/screenshot-core");
const { backEnds, DEFAULT_OPTIONS } = require("../singlefile/cli/single-file-cli-api");
const DEFAULT_LOAD_PAGE_OPTIONS = { timeout: 0, waitUntil: "networkidle2" };

getScreenshot(require("./screenshot-args"))
	.catch(error => console.error(error.message || error)); // eslint-disable-line no-console	

async function getScreenshot(options) {
	let browser;
	try {
		const singleFileOptions = Object.assign({}, DEFAULT_OPTIONS, { browserHeadless: true, loadDeferredImages: false, url: options.url });
		browser = await backEnds.puppeteer.initialize(singleFileOptions);
		let page = await browser.newPage();
		await preparePage(page, options);
		const pageData = await backEnds.puppeteer.getPageData(singleFileOptions, page);
		await page.close();
		page = await browser.newPage();
		await preparePage(page, options);
		await page.setContent(pageData.content, Object.assign({}, DEFAULT_LOAD_PAGE_OPTIONS, options.pageLoadOptions));
		return await screenshot(page, options);
	} finally {
		if (browser) {
			await backEnds.puppeteer.closeBrowser();
		}
	}
}