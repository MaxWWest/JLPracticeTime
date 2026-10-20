const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");
const { buildBank, passages } = require("./reading-content.js");

async function main() {
	const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
	const url = process.env.READING_TEST_URL || pathToFileURL(path.join(__dirname, "main.html")).href;
	try {
		for (const width of [1440, 390, 320]) {
			const page = await browser.newPage({ viewport: { width, height: 900 } });
			const errors = [];
			page.on("pageerror", error => errors.push(error.message));
			await page.goto(url);
			await page.locator("#reading-tab").click();
			// Use the real rendering/grading path for every authored question, not just a random sample.
			await page.evaluate(() => {
				window.originalReadingSelection = ReadingContent.selectSession;
				ReadingContent.selectSession = () => ReadingContent.buildBank(ReadingContent.passages);
			});
			await page.locator('[data-rh-start="passages"]').click();
			const bank = buildBank(passages);
			for (const [index, item] of bank.entries()) {
				assert.equal(await page.locator("#rh-band").textContent(), item.prompt);
				assert.equal(await page.locator("#rh-body .rh-hint-table").count(), 0);
				assert.equal(await page.locator("#rh-hero").evaluate(el => el.classList.contains("is-incorrect")), false);
				assert.equal(await page.locator("#rh-session").evaluate(el => el.scrollWidth > el.clientWidth + 2), false);
				const wrong = index % 5 === 0;
				const answer = wrong ? item.options[1] : item.answer;
				await page.getByRole("button", { name: answer, exact: true }).click();
				const feedback = await page.locator("#rh-feedback").textContent();
				assert.ok(feedback.includes(item.explanation));
				if (wrong) assert.ok(feedback.includes(item.distractorFeedback[answer]));
				assert.equal(await page.locator("#rh-body button.rh-choice-option:enabled").count(), 0);
				if (index === 18) await page.screenshot({ path: `/tmp/kotoba-reading-evidence-${width}.png`, fullPage: true });
				await page.locator("#rh-next").click();
			}
			assert.equal(await page.locator("#rh-result").textContent(), "28 of 36 correct (78%).");
			assert.ok((await page.locator("#rh-missed").textContent()).includes("Reference tracking"));
			assert.equal(await page.locator("#rh-setup").isVisible(), false);
			const box = await page.locator("#rh-result").boundingBox();
			assert.ok(box.y >= 0 && box.y + box.height <= 900);
			await page.screenshot({ path: `/tmp/kotoba-reading-results-${width}.png`, fullPage: true });

			// Normal, unmodified session selection must show ten different passages.
			await page.evaluate(() => { ReadingContent.selectSession = window.originalReadingSelection; });
			await page.locator("#rh-menu").click();
			await page.locator('[data-rh-start="passages"]').click();
			const seen = new Set();
			for (let index = 0; index < 10; index++) {
				const text = await page.locator(".rh-passage").textContent();
				assert.ok(!seen.has(text), "Repeated passage within a normal round");
				seen.add(text);
				await page.locator(".rh-choice-option").first().click();
				await page.locator("#rh-next").click();
			}
			assert.match(await page.locator("#rh-result").textContent(), /of 10 correct/);
			// Other bank modes still render, grade, and reach results after an early exit.
			for (const [mode, selector, focus] of [
				["agents", "#rh-agent-focus", "meaning"], ["mood", "#rh-mood-focus", "tone"],
				["breaks", "#rh-break-focus", "role"], ["quotes", "#rh-quote-focus", "force"]
			]) {
				await page.locator("#rh-menu").click();
				await page.locator(selector).selectOption(focus);
				await page.locator(`[data-rh-start="${mode}"]`).click();
				if (mode !== "quotes") assert.equal(await page.locator("#rh-body .rh-hint-table").count(), 0);
				await page.locator(".rh-choice-option").first().click();
				await page.locator("#rh-home").click();
				assert.match(await page.locator("#rh-result").textContent(), /of 1 correct/);
			}
			assert.deepEqual(errors, []);
			await page.close();
			console.log(`PASS reading at ${width}px: all 36 new questions, normal 10-question round, four other modes, visible results, no overflow.`);
		}
	} finally {
		await browser.close();
	}
}
main().catch(error => { console.error(error); process.exitCode = 1; });
