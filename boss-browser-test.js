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
		await page.goto(process.env.GRAMMAR_TEST_URL || pathToFileURL(path.join(__dirname, "main.html")).href);
		await page.locator("#grammar-tab").click();
		await page.locator('[data-subtab-target="grammar-practice-panel"]').click();
		await page.locator('[data-gp-filter="boss"]').click();
		assert.deepEqual(await page.locator("#gp-count-boss-01-05 option").allTextContents(), ["10"]);
		await page.locator('[data-gp-start="boss-01-05"]').click();
		const first = await page.evaluate(() => gpState.queue.map((q) => q.meta.sceneKey));
		assert.equal(first.length, 10);
		assert.equal(await page.locator("#gp-session-notes").isVisible(), false);
		for (let i = 0; i < 10; i++) {
			const q = await page.evaluate(() => gpState.queue[gpState.index]);
			assert.equal(q.meta.engine, "boss-01-05-v1");
			assert.equal(await page.locator("#gp-session").evaluate((el) => el.scrollTop), 0);
			const before = await page.locator("#gp-session").innerText();
			assert.ok(!before.includes(q.promptEnglish));
			assert.ok(!before.includes(q.explanation));
			assert.ok(!before.includes(q.meta.pattern));
			assert.match(await page.locator("#gp-type").textContent(), /^BOSS · 01-05 · /);
			const correct = i % 2 === 0, choice = correct ? q.answer : Object.keys(q.choiceFeedback)[0];
			assert.equal(Boolean(q.fields), i >= 8);
			if (q.fields) {
				assert.equal(await page.locator("[placeholder]").filter({ visible: true }).count(), 0);
				await page.locator('[data-gp-part="0"]').fill(choice);
				await page.locator('#gp-answer-form button[type="submit"]').click();
			} else await page.locator(`[data-gp-choice="${q.options.indexOf(choice)}"]`).click();
			assert.equal(await page.locator("#gp-feedback").textContent(), correct ? "Correct." : "Not quite.");
			if (!correct) {
				const coaching = await page.locator(".gp-coaching-card").evaluate((el) => {
					const copy = el.cloneNode(true);
					copy.querySelectorAll("rt").forEach((rt) => rt.remove());
					return copy.textContent;
				});
				assert.ok(coaching.includes(q.fields ? q.fields[0].contrasts.find((c) => c.accepted.includes(choice)).message : q.choiceFeedback[choice]));
			}
			assert.equal(await page.locator("#gp-retry-pattern").count(), 0, "A full pilot does not recycle an already used case as a retry");
			await page.locator("#gp-next").click();
		}
		assert.equal(await page.locator("#gp-final-correct").textContent(), "5/10");
		await page.locator("#gp-again").click();
		await page.locator('[data-gp-start="boss-01-05"]').click();
		const next = await page.evaluate(() => gpState.queue.map((q) => q.meta.sceneKey));
		assert.ok(next.every((key) => !first.includes(key)), "Second round changes the fact variants");
		for (const width of [1440, 390, 320]) {
			await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
			const ids = await page.evaluate(() => gpState.bank.map((q) => q.meta.id));
			for (const id of ids) {
				await page.evaluate((id) => {
					const q = gpState.bank.find((q) => q.meta.id === id);
					gpState.queue = [q.writing ? { ...q, ...q.writing, mode: "text", options: undefined, kind: "Final challenge", band: "Write one Japanese sentence." } : q];
					gpState.index = 0;
					showGrammarPracticeQuestion();
				}, id);
				const overflow = await page.evaluate(() => [...document.querySelectorAll("#gp-prompt, #gp-subprompt, #gp-band, .gp-options button, .gp-field")].filter((el) => {
					const rect = el.getBoundingClientRect();
					return rect.width && (rect.left < -1 || rect.right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2);
				}).map((el) => el.id || el.className));
				assert.deepEqual(overflow, [], `${id} at ${width}px`);
				if (["study-booking:0", "moving-help:1", "first-visit:2"].includes(id) && width !== 320) await page.screenshot({ path: `/tmp/kotoba-boss-${width}-${id.replace(":", "-")}.png` });
			}
		}
		await page.evaluate(() => startGrammarPractice("comparison", 25, { focus: "review" }));
		assert.equal(await page.locator("#gp-session-notes").isVisible(), true);
		assert.equal(await page.evaluate(() => gpState.queue.length), 25);
		assert.deepEqual(errors, []);
		console.log("PASS: live Boss entry, 10-question scoring, answer-specific feedback, hidden hints, variant freshness, all 40 pilot items at 1440/390/320px, and Review restoration.");
	} finally { await browser.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
