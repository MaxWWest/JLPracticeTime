const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require("playwright");

async function main() {
	const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
	const url = process.env.GRAMMAR_TEST_URL || pathToFileURL(path.join(__dirname, "main.html")).href;
	try {
		for (const width of [1440, 390]) {
			const page = await browser.newPage({ viewport: { width, height: 900 } }), errors = [];
			page.on("pageerror", error => errors.push(error.message));
			for (const unit of ["comparison", "time", "invitation", "ability", "experience"]) {
				await page.goto(url);
				await page.locator("#grammar-tab").click();
				await page.locator('[data-subtab-target="grammar-practice-panel"]').click();
				await page.locator(`[data-gp-session-card="${unit}"] select`).selectOption("10");
				await page.locator(`[data-gp-start="${unit}"]`).click();
				const mix = await page.evaluate(() => gpState.queue.map(q => q.mode));
				assert.equal(mix.length, 10);
				assert.ok(mix.filter(mode => mode === "text").length >= 7);
				assert.equal(await page.locator("#gp-setup").evaluate(el => getComputedStyle(el).display), "none");
				for (let i = 0; i < 10; i++) {
					const q = await page.evaluate(() => gpState.queue[gpState.index]), wrong = i < 2;
					if (q.fields) {
						assert.equal(await page.locator("#gp-body textarea, #gp-body [placeholder]").count(), 0);
						for (const [part, f] of q.fields.entries()) {
							const control = page.locator(`[data-gp-part="${part}"]`);
							assert.equal(await control.inputValue(), "");
							const value = wrong && part === 0 ? (f.options?.find(value => !f.accepted.includes(value)) || "wrong") : f.answer;
							if (f.options) await control.selectOption(value);
							else await control.fill(value);
						}
						await page.locator('#gp-answer-form button[type="submit"]').click();
					} else {
						const choice = wrong ? q.options.findIndex(value => value !== q.answer) : q.options.indexOf(q.answer);
						await page.locator(`[data-gp-choice="${choice}"]`).click();
					}
					assert.equal(await page.locator("#gp-feedback").textContent(), wrong ? "Not quite." : "Correct.");
					await page.locator("#gp-next").click();
				}
				assert.equal(await page.locator("#gp-final-correct").textContent(), "8/10");
				assert.equal(await page.locator("#gp-final-accuracy").textContent(), "80%");
				assert.equal(await page.locator("#gp-complete-title").textContent(), "Review stats");
				assert.equal(await page.locator("#gp-session").isVisible(), false);
				assert.equal(await page.locator("#gp-setup").isVisible(), false);
				for (const selector of ["#gp-complete-title", "#gp-final-correct", "#gp-final-accuracy"]) {
					const bounds = await page.locator(selector).boundingBox();
					assert.ok(bounds && bounds.y >= 0 && bounds.y + bounds.height <= 900, `${unit} ${width}px: ${selector} is offscreen`);
				}
				await page.screenshot({ path: `/tmp/kotoba-review-stats-${unit}-${width}.png` });
				console.log(`PASS: ${unit} ${width}px, 10 questions, accurate 8/10 results in viewport.`);
			}
			await page.evaluate(() => startGrammarPractice("comparison", 25, { focus: "review" }));
			for (const task of ["opposite", "repair", "production", "three-forms"]) {
				await page.evaluate(task => {
					const source = gpState.bank.find(q => q.meta.task === task && (q.meta.structure === "direct" || q.meta.structure === "change"));
					gpState.queue = [GrammarPracticeCore.compact(source, 17)];
					gpState.index = 0;
					showGrammarPracticeQuestion();
				}, task);
				if (task === "opposite") assert.ok((await page.locator("#gp-subprompt strong").allTextContents()).includes("Reverse the relationship"));
				if (task === "repair") assert.equal(await page.locator("#gp-band").textContent(), "Correct the draft.");
				if (["production", "three-forms"].includes(task)) {
					assert.equal(await page.locator("#gp-prompt-label").isVisible(), true);
					assert.doesNotMatch(await page.locator("#gp-subprompt").textContent(), /今月|先月/);
				}
				const overflow = await page.locator("#gp-session").evaluate(el => el.scrollWidth > el.clientWidth + 2);
				assert.equal(overflow, false, `${task} ${width}px overflow`);
				await page.screenshot({ path: `/tmp/kotoba-review-${task}-${width}.png` });
			}
			assert.deepEqual(errors, []);
			await page.close();
		}
	} finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
