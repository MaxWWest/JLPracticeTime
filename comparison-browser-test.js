const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

async function main() {
	const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
	const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	try {
		await page.goto(process.env.COMPARISON_TEST_URL || pathToFileURL(path.join(__dirname, "main.html")).href);
		await page.locator("#grammar-tab").click();
		await page.locator('[data-subtab-target="grammar-practice-panel"]').click();
		await page.locator("#gp-start").click();
		const overview = await page.evaluate(() => gpState.queue.map((q) => ({ task: q.meta.task, family: q.meta.familyKey, engine: q.meta.engine })));
		assert.equal(overview.length, 25);
		assert.equal(new Set(overview.map((q) => q.family)).size, 25);
		assert.equal(new Set(overview.map((q) => q.task)).size, 12);
		assert.ok(overview.every((q) => q.engine === "comparison-v2"));

		for (let i = 0; i < 25; i++) {
			assert.equal(await page.locator("#gp-session").evaluate((session) => session.scrollTop), 0, "New questions start at the passage");
			const question = await page.evaluate(() => gpState.queue[gpState.index]);
			if (question.fields) {
				assert.equal(await page.locator("[data-gp-part]").count(), question.fields.length);
				assert.equal(await page.locator("#gp-body [placeholder]").count(), 0);
				for (let part = 0; part < question.fields.length; part++) {
					const answer = await page.evaluate(({ part }) => getComparisonPracticeEngine().normalize(gpState.queue[gpState.index].fields[part].accepted.at(-1)), { part });
					await page.locator(`[data-gp-part="${part}"]`).fill(answer);
				}
				await page.locator('#gp-answer-form button[type="submit"]').click();
			} else await page.locator(`[data-gp-choice="${question.options.indexOf(question.answer)}"]`).click();
			assert.equal(await page.locator("#gp-feedback").textContent(), "Correct.");
			await page.locator("#gp-next").click();
		}
		assert.equal(await page.locator("#gp-final-correct").textContent(), "25/25");
		assert.equal(await page.locator("#gp-complete").isVisible(), true);
		await page.locator("#gp-again").click();
		await page.locator('[data-gp-filter="boss"]').click();
		await page.locator('[data-gp-start="boss-01-05"]').click();
		const boss = await page.evaluate(() => gpState.queue.map((q) => ({ source: q.meta.sourceSessionId, engine: q.meta.engine })));
		for (const source of ["comparison", "time", "invitation", "ability", "experience"]) assert.equal(boss.filter((q) => q.source === source).length, 5);
		assert.ok(boss.filter((q) => q.source === "comparison").every((q) => q.engine === "comparison-v2"));

		// Isolate every presentation shape, including the longest passage, at narrow widths.
		await page.evaluate(() => startGrammarPractice("comparison", 25, { focus: "review" }));
		for (const width of [1440, 390, 320]) {
			await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
			for (const task of [...new Set(overview.map((q) => q.task))]) {
				await page.evaluate((task) => {
					const q = gpState.bank.filter((q) => q.meta.task === task).sort((a, b) => b.prompt.length - a.prompt.length)[0];
					gpState.queue = [q];
					gpState.index = 0;
					showGrammarPracticeQuestion();
					gpEls.session.scrollTop = 0;
				}, task);
				const overflow = await page.evaluate(() => {
					const session = document.querySelector("#gp-session");
					return [...session.querySelectorAll("#gp-prompt, #gp-subprompt, #gp-band, .gp-options button, .gp-answer, .gp-field")].filter((el) => {
						const r = el.getBoundingClientRect();
						return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2);
					}).map((el) => el.id || el.className);
				});
				assert.deepEqual(overflow, [], `${width}px ${task} overflow`);
				if (["paired-blanks", "tradeoff", "three-forms"].includes(task) && width !== 320) {
					await page.screenshot({ path: `/tmp/kotoba-comparison-${width}-${task}.png` });
				}
			}
		}

		await page.evaluate(() => {
			gpState.queue = [gpState.bank.find((q) => q.meta.task === "paired-blanks")];
			gpState.index = 0;
			showGrammarPracticeQuestion();
		});
		const correctSecond = await page.evaluate(() => gpState.queue[0].fields[1].answer);
		assert.equal(await page.locator('[data-gp-part="1"]').evaluate((input) => getComputedStyle(input).borderTopWidth), "1px");
		await page.locator('[data-gp-part="0"]').fill("wrong");
		await page.locator('[data-gp-part="1"]').fill(correctSecond);
		await page.locator('#gp-answer-form button[type="submit"]').click();
		assert.equal(await page.locator(".gp-field.is-incorrect").count(), 1);
		assert.equal(await page.locator(".gp-field.is-correct").count(), 1);
		const original = await page.evaluate(() => gpState.queue[0].meta.familyKey);
		await page.locator("#gp-retry-pattern").click();
		assert.notEqual(await page.evaluate(() => gpState.queue[gpState.index].meta.familyKey), original);
		assert.equal(await page.evaluate(() => gpState.queue[gpState.index].meta.engine), "comparison-v2");
		assert.deepEqual(errors, []);
		console.log("PASS: complete 25-question Review, mixed Boss, kana grading, partial feedback, fresh retry, and all 12 formats at 1440/390/320px.");
	} finally {
		await browser.close();
	}
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
