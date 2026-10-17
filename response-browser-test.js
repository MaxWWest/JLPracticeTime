const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

async function main() {
	const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || "chrome" });
	const page = await browser.newPage();
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	try {
		await page.goto(process.env.GRAMMAR_TEST_URL || pathToFileURL(path.join(__dirname, "main.html")).href);
		await page.locator("#grammar-tab").click();
		await page.locator('[data-subtab-target="grammar-practice-panel"]').click();
		for (const unit of ["comparison", "time", "invitation", "ability", "experience"]) {
			await page.evaluate((unit) => {
				startGrammarPractice(unit, 25, { focus: "review" });
				const length = (q) => Math.max(0, ...q.responseSpec.fields.flatMap((f) => (f.options || []).map((o) => o.length)));
				const q = gpState.bank.filter((q) => q.responseSpec).sort((a, b) => length(b) - length(a))[0];
				gpState.queue = [GrammarPracticeCore.compact(q)]; gpState.index = 0;
				showGrammarPracticeQuestion();
			}, unit);
			for (const width of [1440, 390, 320]) {
				await page.setViewportSize({ width, height: 900 });
				const clipped = await page.evaluate(() => {
					const context = document.createElement("canvas").getContext("2d");
					return [...document.querySelectorAll("#gp-answer-form select")].filter((select) => {
						const css = getComputedStyle(select); context.font = `${css.fontSize} ${css.fontFamily}`;
						const needed = Math.max(...[...select.options].map((o) => context.measureText(o.textContent).width)) + 30;
						return needed > select.clientWidth;
					}).map((select) => ({ id: select.id, width: select.clientWidth }));
				});
				assert.deepEqual(clipped, [], `${unit}: clipped choices at ${width}px`);
				await page.locator("#gp-answer-form").scrollIntoViewIfNeeded();
				await page.screenshot({ path: `/tmp/kotoba-response-${unit}-${width}.png` });
			}
		}
		await page.evaluate(() => {
			startGrammarPractice("comparison", 25, { focus: "review" });
			gpState.queue = [GrammarPracticeCore.compact(gpState.bank.find((q) => q.meta.task === "rewrite-hou" && q.responseSpec?.fields.every((f) => !f.options)))];
			gpState.index = 0; showGrammarPracticeQuestion();
		});
		const fields = await page.evaluate(() => gpState.queue[0].fields);
		for (let i = 0; i < fields.length; i++) await page.locator(`[data-gp-part="${i}"]`).fill(fields[i].answer);
		const first = page.locator('[data-gp-part="0"]');
		await first.focus();
		assert.equal(await first.evaluate((input) => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", isComposing: true, bubbles: true, cancelable: true }))), false);
		assert.equal(await page.evaluate(() => gpState.answered), false);
		await first.press("Enter");
		assert.equal(await page.evaluate(() => document.activeElement.dataset.gpPart), "1");
		assert.equal(await page.evaluate(() => gpState.answered), false);
		await page.locator('[data-gp-part="1"]').press("Enter");
		assert.equal(await page.locator("#gp-feedback").textContent(), "Correct.");
		const model = await page.evaluate(() => GrammarPracticeCore.completeResponse(gpState.queue[0]));
		const shown = await page.locator(".gp-coaching-answer strong").first().evaluate((el) => { const copy = el.cloneNode(true); copy.querySelectorAll("rt").forEach((rt) => rt.remove()); return copy.textContent; });
		assert.equal(shown, model);
		assert.deepEqual(errors, []);
		console.log("PASS: longest dropdowns fit desktop/mobile, IME confirmation does not submit, Enter advances, and feedback reconstructs the sentence.");
	} finally { await browser.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
