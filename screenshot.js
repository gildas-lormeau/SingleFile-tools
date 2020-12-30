#!/usr/bin/env node

/* global require */

const fs = require("fs");
const puppeteer = require("puppeteer-core");
const { screenshot, preparePage } = require("./lib/screenshot-core");
const DEFAULT_LOAD_PAGE_OPTIONS = { timeout: 0, waitUntil: "networkidle2" };
const DEFAULT_CHARSET = "UTF-8";
const FILE_STDIN = 0;

getScreenshot(require("./screenshot-args"))
	.catch(error => console.error(error.message || error)); // eslint-disable-line no-console	

async function getScreenshot(options) {
	let browser;
	try {
		browser = await puppeteer.launch(options.browserOptions);
		const page = await browser.newPage();
		const pageLoadOptions = Object.assign({}, DEFAULT_LOAD_PAGE_OPTIONS, options.pageLoadOptions);
		await preparePage(page, options);
		if (options.url) {
			await page.goto(options.url, pageLoadOptions);
		} else {
			await page.setContent(fs.readFileSync(FILE_STDIN, options.stdinCharset || DEFAULT_CHARSET), pageLoadOptions);
		}
		return await screenshot(page, options);
	} finally {
		if (browser) {
			await browser.close();
		}
	}
}