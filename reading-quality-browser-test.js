const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const { instrument } = require("./reading-test-runtime.js");

async function answer(page, wrong = false) {
	const current = await page.evaluate(() => readingTestApi.getSession().current);
	if (current.task?.type === "mark") {
		const mode = await page.evaluate(() => readingTestApi.getSession().mode);
		const positions = mode === "breaks" ? current.item.breaks : [current.item.start, current.item.end];
		for (const position of positions) {
			const gap = page.locator(`#rh-sentence [data-gap="${position}"]`);
			assert.equal(await gap.count(), 1, `Furigana hid a necessary marking boundary: ${current.item.text} @ ${position}`);
			if (!wrong) await gap.click();
		}
		await page.locator("#rh-check").click();
	} else if (current.task?.type === "order") {
		await page.locator("#rh-answer-input").fill(wrong ? "zz" : current.answer.join(" "));
		// Use a wrong valid letter, since invalid letters are intentionally stripped.
		if (wrong) await page.locator("#rh-answer-input").fill(current.answer[0] === "a" ? "b" : "a");
		await page.locator("#rh-submit").click();
	} else {
		const gold = current.choiceAnswer || current.item.answer;
		const values = await page.locator(".rh-choice-option").evaluateAll(nodes => nodes.map(node => node.dataset.choice));
		assert.equal(values.filter(value => value === gold).length, 1, "Gold answer must appear exactly once");
		const chosen = wrong ? values.find(value => value !== gold) : gold;
		await page.locator(".rh-choice-option").filter({ hasText: "" }).evaluateAll((nodes, chosen) => {
			nodes.find(node => node.dataset.choice === chosen).click();
		}, chosen);
	}
	const feedback = await page.locator("#rh-feedback").textContent();
	assert.ok(feedback.startsWith(wrong ? "Not quite." : "Correct!"), feedback);
	assert.equal(await page.locator("#rh-session").evaluate(el => el.scrollWidth > el.clientWidth + 2), false);
	await page.locator("#rh-next").click();
}

async function main() {
	const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
	try {
		for (const width of [1440, 390, 320]) {
			const page = await browser.newPage({ viewport: { width, height: 900 } });
			const errors = [];
			page.on("pageerror", error => errors.push(error.message));
			await page.route("**/reading.js*", route => route.fulfill({
				contentType: "application/javascript", body: instrument(fs.readFileSync(path.join(__dirname, "reading.js"), "utf8"))
			}));
			await page.goto(pathToFileURL(path.join(__dirname, "main.html")).href);
			await page.locator("#reading-tab").click();
			await page.waitForFunction(() => typeof readingTestApi !== "undefined");
			assert.equal(await page.locator("[data-rh-start]").count(), 8);
			for (const mode of ["stack", "breaks", "quotes", "agents", "mood", "passages", "references", "connections"]) {
				await page.locator(`[data-rh-start="${mode}"]`).click();
				assert.equal(await page.evaluate(() => readingTestApi.getSession().count), 10);
				const sources = new Set();
				for (let index = 0; index < 10; index++) {
					const current = await page.evaluate(() => readingTestApi.getSession().current);
					const source = current.finalText || ReadingSource(current.item);
					assert.ok(!sources.has(source)); sources.add(source);
					if (["references", "connections"].includes(mode) && index === 0) {
						await page.screenshot({ path: `/tmp/kotoba-${mode}-${width}.png` });
					}
					await answer(page, index < 2);
				}
				assert.equal(await page.locator("#rh-result").textContent(), "8 of 10 correct (80%).");
				assert.equal(await page.locator("#rh-setup").isVisible(), false);
				const result = await page.locator("#rh-result").boundingBox();
				assert.ok(result.y >= 0 && result.y + result.height <= 900, `${mode}: offscreen results`);
				await page.locator("#rh-menu").click();
			}
			// Exhaust each new bank through the actual UI, beyond a random session.
			for (const mode of ["references", "connections"]) {
				await page.evaluate(mode => {
					window.savedReadingSelection = ReadingContent.selectSession;
					ReadingContent.selectSession = () => ReadingSkills[mode];
				}, mode);
				await page.locator(`[data-rh-start="${mode}"]`).click();
				const count = await page.evaluate(() => readingTestApi.getSession().count);
				for (let index = 0; index < count; index++) await answer(page);
				assert.equal(await page.locator("#rh-result").textContent(), `${count} of ${count} correct (100%).`);
				await page.evaluate(() => { ReadingContent.selectSession = window.savedReadingSelection; });
				await page.locator("#rh-menu").click();
			}
			// Boundaries must remain clickable with furigana enabled for every legacy item.
			if (width === 390) {
				for (const [mode, focusId, bank] of [["breaks", "#rh-break-focus", "breakBank"], ["quotes", "#rh-quote-focus", "quoteBank"]]) {
					await page.locator(focusId).selectOption("mark");
					await page.evaluate(bank => {
						window.savedReadingSelection = ReadingContent.selectSession;
						ReadingContent.selectSession = () => readingTestApi[bank];
					}, bank);
					await page.locator(`[data-rh-start="${mode}"]`).click();
					const count = await page.evaluate(() => readingTestApi.getSession().count);
					for (let index = 0; index < count; index++) await answer(page);
					await page.evaluate(() => { ReadingContent.selectSession = window.savedReadingSelection; });
					await page.locator("#rh-menu").click();
				}
			}
			assert.deepEqual(errors, []);
			await page.close();
			console.log(`PASS ${width}px: all eight modes score 8/10, all 80 new questions grade correctly, visible results, no horizontal overflow.`);
		}
	} finally { await browser.close(); }
}
function ReadingSource(item) { return item.sourceId || item.text || item.sentence; }
main().catch(error => { console.error(error); process.exitCode = 1; });
