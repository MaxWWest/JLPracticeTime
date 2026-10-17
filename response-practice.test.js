const assert = require("node:assert/strict");
const test = require("node:test");
const core = require("./grammar-practice-core.js");
const boss = require("./boss-practice.js");
const runtime = require("./grammar-audit.js").loadGrammarRuntime();
const names = { comparison: "Comparison", time: "Time", invitation: "Invitation", ability: "Ability", experience: "Experience" };

for (const [unit, name] of Object.entries(names)) {
	const engine = runtime[`get${name}PracticeEngine`](), bank = engine.buildBank();
	test(`${unit}: every compact frame reconstructs a checked full response`, () => {
		for (const original of bank.filter((q) => q.responseSpec)) {
			const q = core.compact(original, 17), answers = q.fields.map((f) => f.answer);
			assert.equal(engine.grade(q, answers).correct, true, q.meta.id);
			assert.equal(engine.grade(original, core.completeResponse(q).split("\n")).correct, true, `${q.meta.id}: ${core.completeResponse(q)}`);
			for (const [i, field] of q.fields.entries()) {
				assert.equal(field.multiline, false);
				assert.ok(!field.placeholder);
				if (field.options) {
					assert.ok(field.options.includes(field.answer));
					assert.equal(new Set(field.options).size, field.options.length);
					assert.ok(field.options.some((option) => !field.accepted.some((answer) => engine.normalize(answer) === engine.normalize(option))), q.meta.id);
				} else {
					assert.ok(field.answer.length <= 6, `${q.meta.id}: excessive copying`);
					assert.match(field.answer, /^(?:より|よりも|のほうが|ほうが|は|ほど|ながら|まで|までに|ませんか|ましょう|ましょうか)$/);
				}
				const kana = [...answers]; kana[i] = engine.normalize(field.accepted.at(-1));
				assert.equal(engine.grade(q, kana).correct, true, `${q.meta.id}: kana gap ${i}`);
				const wrong = [...answers]; wrong[i] = "invalid";
				const graded = engine.grade(q, wrong);
				assert.equal(graded.correct, false);
				assert.equal(graded.parts.filter(Boolean).length, answers.length - 1);
			}
		}
	});
	test(`${unit}: routed Review eliminates full-sentence copying without changing the task mix`, () => {
		const queue = runtime.buildFocusedGrammarQueue(unit, bank, "review", 25);
		assert.equal(queue.length, 25);
		assert.equal(new Set(queue.map((q) => q.meta.task)).size, 12);
		assert.ok(queue.filter((q) => q.fields).every((q) => q.fields.every((f) => !f.multiline)));
		let before = 0, after = 0;
		for (const original of bank.filter((q) => q.fields)) {
			before += original.fields.reduce((sum, f) => sum + f.answer.length, 0);
			after += core.compact(original).fields.reduce((sum, f) => sum + (f.options ? 0 : f.answer.length), 0);
		}
		assert.ok(after < before * 0.4, `${unit}: ${after}/${before} typed characters`);
	});
}

test("Boss production is confined to the final two questions, with legitimate forms and wrong meanings distinguished", () => {
	const engine = runtime.getBossPracticeEngine(), bank = engine.buildBank();
	for (let seed = 0; seed < 30; seed++) {
		const queue = boss.selectQueue(bank, 10, { seed });
		assert.equal(queue.length, 10);
		assert.ok(queue.slice(0, 8).every((q) => !q.fields));
		assert.ok(queue.slice(8).every((q) => q.fields?.length === 1));
		for (const q of queue.slice(8)) {
			for (const accepted of q.fields[0].accepted) assert.ok(engine.grade(q, [engine.normalize(accepted)]).correct, accepted);
			for (const wrong of Object.keys(q.choiceFeedback)) assert.equal(engine.grade(q, [wrong]).correct, false, wrong);
			assert.ok(!q.prompt.includes(q.answer));
			assert.ok(!q.fields[0].placeholder);
		}
	}
});

test("choice order varies without modifying the stored response specification", () => {
	const q = { mode: "text", meta: {}, responseSpec: core.cloze([{ label: "test", segments: ["A", core.gap("marker", ["より"], ["より", "ほど", "から", "まで"]), "B"] }], "Complete.") };
	const original = JSON.stringify(q);
	assert.ok(new Set(Array.from({ length: 20 }, (_, seed) => core.compact(q, seed).fields[0].options.join("/"))).size > 5);
	assert.equal(JSON.stringify(q), original);
});
