#!/usr/bin/env node

/* global require */

const { screenshot, preparePage } = require("./lib/screenshot-core");
const { getBackEnd, DEFAULT_OPTIONS } = require("single-file");
const DEFAULT_LOAD_PAGE_OPTIONS = { timeout: 0 };

getScreenshot(require("./screenshot-args"))
	.catch(error => console.error(error.message || error)); // eslint-disable-line no-console	

async function getScreenshot(options) {
	let backEnd;
	try {
		options = Object.assign({}, options);
		options.screenshotOptions.idleWaitEnabled = false;
		const singleFileOptions = Object.assign({}, DEFAULT_OPTIONS, { loadDeferredImages: false, url: options.url });
		backEnd = getBackEnd("puppeteer");
		const browser = await backEnd.initialize(singleFileOptions);
		let page = await browser.newPage();
		await preparePage(page, options);
		const pageData = await backEnd.getPageData(singleFileOptions, page);
		await page.close();
		page = await browser.newPage();
		await preparePage(page, options);
		await page.setContent(pageData.content, Object.assign({}, DEFAULT_LOAD_PAGE_OPTIONS, options.pageLoadOptions, { waitUntil: "load" }));
		return await screenshot(page, options);
	} finally {
		if (backEnd) {
			await backEnd.closeBrowser();
		}
	}
}