const assert = require("node:assert/strict");
const test = require("node:test");
const core = require("./grammar-practice-core.js");
const boss = require("./boss-practice.js");
const runtime = require("./grammar-audit.js").loadGrammarRuntime();
const input = { nounPools: runtime.comparisonNounPools, adjectivePool: runtime.comparisonAdjectivePool, verbPool: runtime.grammarVerbPool, aliases: runtime.comparisonKanaAnswerAliases };

// Exclude the passage, but retain every visible instruction, label, fixed chunk and word-bank entry.
// Option position is deliberately excluded: it is randomized separately from semantic generation.
function scaffold(q) {
	return JSON.stringify({ kind: q.kind, subprompt: q.subprompt, band: q.band, vocabulary: q.vocabulary, rows: q.responseRows, fields: q.fields.map(f => ({ label: f.label, options: f.options ? [...f.options].sort() : null })) });
}
function counterfactuals(questions, engine) {
	const seen = new Map(), pairs = [];
	for (const source of questions) {
		const q = core.compact(source, 17), key = scaffold(q), previous = seen.get(key);
		if (previous && previous.prompt !== q.prompt && previous.answer !== q.answer) {
			const previousAnswers = previous.fields.map(f => f.answer), answers = q.fields.map(f => f.answer);
			assert.equal(engine.grade(previous, previousAnswers).correct, true);
			assert.equal(engine.grade(q, answers).correct, true);
			assert.equal(engine.grade(previous, answers).correct, false, q.meta.id);
			assert.equal(engine.grade(q, previousAnswers).correct, false, q.meta.id);
			pairs.push([previous, q]);
		} else seen.set(key, q);
	}
	return pairs;
}

test("comparison: identical visible frames can require opposite marker orders and entity roles", () => {
	const module = require("./comparison-practice.js"), engine = module.create({ ...input, seed: 1 });
	const samples = Array.from({ length: 20 }, (_, seed) => module.create({ ...input, seed }).buildBank()).flat();
	for (const task of ["rewrite-hou", "rewrite-hodo", "three-forms"]) {
		const pairs = counterfactuals(samples.filter(q => q.meta.task === task), engine);
		assert.ok(pairs.length >= 5, `${task}: only ${pairs.length} passage-dependent contrasts`);
	}
	for (const q of samples.filter(q => q.meta.task === "rewrite-hodo")) assert.ok(core.compact(q).fields.every(f => f.options), "Do not ask the learner to type a marker already named by the instruction");
});

test("time: changing the passage's main activity changes the answer, not the vocabulary ordering", () => {
	const module = require("./time-practice.js"), engine = module.create({ ...input, seed: 1 });
	const samples = Array.from({ length: 8 }, (_, seed) => module.create({ ...input, seed }).buildBank()).flat().filter(q => q.meta.task === "combine-actions");
	assert.ok(counterfactuals(samples, engine).length >= 20);
	for (const original of samples) {
		const q = core.compact(original), primary = original.meta.responseActions[1];
		assert.ok(!q.subprompt.includes(primary.ing));
		assert.ok(original.prompt.includes(`Your main task is to ${primary.en}.`));
		assert.equal(q.fields[2].answer, primary.masu);
		assert.equal(original.meta.facts.mainAction, primary.id);
	}
});

test("invitations: role changes and two-message ordering come from the situation, not field labels", () => {
	const engine = require("./invitation-practice.js").create({ ...input, seed: 17 }), bank = engine.buildBank();
	assert.ok(counterfactuals(bank.filter(q => q.meta.task === "change-actor"), engine).length >= 20);
	assert.ok(counterfactuals(bank.filter(q => q.meta.task === "two-intents"), engine).length >= 10);
	for (const source of bank.filter(q => q.responseSpec)) {
		const q = core.compact(source);
		assert.equal(q.kind, "Complete the exchange");
		assert.ok(q.fields.every(f => !/offer|invitation|you do|together/i.test(f.label)));
		if (q.meta.task === "two-intents") for (const n of [1, 2]) assert.ok(q.prompt.includes(`Message ${n}:`));
	}
});

test("experience: current-pattern prompts share neutral labels but require different negation scope", () => {
	const engine = require("./experience-practice.js").create({ ...input, seed: 17 }), bank = engine.buildBank();
	const samples = bank.filter(q => ["habit-report", "exception-report"].includes(q.meta.task));
	assert.ok(counterfactuals(samples, engine).length >= 20);
	for (const source of samples) {
		const q = core.compact(source);
		assert.equal(q.kind, "Report the current pattern");
		assert.equal(q.fields[0].label, "Report");
	}
});

test("Boss: fresh scenario families span three rounds, and writing reaches every unit", () => {
	const engine = boss.create({ ...input, seed: 17 }), bank = engine.buildBank(), original = JSON.stringify(bank);
	let recent = [];
	const writerRounds = [];
	for (let seed = 0; seed < 120; seed++) {
		const queue = boss.selectQueue(bank, 10, { seed, recent });
		const previousFamilies = new Set(recent.slice(-20).map(key => key.split(":")[0]));
		assert.ok(queue.every(q => !previousFamilies.has(q.meta.familyKey)), `Repeated family at round ${seed}`);
		const writers = queue.slice(8).map(q => q.meta.sourceSessionId);
		assert.equal(new Set(writers).size, 2);
		writerRounds.push(writers);
		if (seed >= 5) assert.equal(new Set(writerRounds.slice(-6).flat()).size, 5, `Writing neglected a unit at round ${seed}`);
		recent = [...recent, ...queue.map(q => q.meta.sceneKey)].slice(-50);
	}
	assert.equal(JSON.stringify(bank), original, "Scheduling must not mutate canonical fields or choices");
});

test("Boss writing: every model has a kana equivalent and alternate orders remain accepted", () => {
	const engine = boss.create({ ...input, seed: 17 }), bank = engine.buildBank();
	const writingUnits = new Set();
	for (const original of bank.filter(q => q.writing)) {
		const q = { ...original, ...original.writing, mode: "text" };
		writingUnits.add(q.meta.sourceSessionId);
		for (const answer of q.fields[0].accepted) {
			const kana = engine.normalize(answer);
			assert.doesNotMatch(kana, /[\u4e00-\u9fff]/, `${q.meta.id}: unhandled kanji in ${kana}`);
			assert.equal(engine.grade(q, [kana]).correct, true, q.meta.id);
		}
	}
	assert.equal(writingUnits.size, 5);
	const commute = bank.find(q => q.meta.task === "commute-total" && q.meta.facts.trainWalk === 5);
	const q = { ...commute, ...commute.writing, mode: "text" };
	for (const answer of ["でんしゃでいくほうがばすでいくよりはやくかいしゃにつきます", "バスで行くより電車で行くほうが早く会社に着きます"]) assert.equal(engine.grade(q, [answer]).correct, true);
	assert.equal(engine.grade(q, ["バスで行くほうが電車で行くより早く会社に着きます"]).correct, false);
});

test("interleaving retains exactly the selected questions and separates repeated formats when feasible", () => {
	for (const source of [[], ["a"], ["a", "b", "b", "a"], ["a", "a", "a", "b", "c"], ["a", "a", "b", "b", "c", "c"]]) {
		const items = source.map((group, id) => ({ group, id })), snapshot = JSON.stringify(items), result = core.interleave(items, q => q.group);
		assert.deepEqual(result.map(q => q.id).sort(), items.map(q => q.id).sort());
		assert.ok(result.every((q, i) => !i || q.group !== result[i - 1].group));
		assert.equal(JSON.stringify(items), snapshot);
	}
});

test("ten-question Reviews prioritize compact grammar use across all five units", () => {
	for (const unit of ["comparison", "time", "invitation", "ability", "experience"]) {
		const api = require(`./${unit}-practice.js`);
		for (let seed = 0; seed < 20; seed++) {
			const bank = api.create({ ...input, seed }).buildBank();
			const queue = api.selectQueue(bank, 10, { seed }).map(q => core.compact(q, seed));
			assert.equal(queue.length, 10, unit);
			assert.ok(queue.filter(q => q.mode === "text").length >= 7, `${unit} seed ${seed}`);
			assert.ok(queue.flatMap(q => q.fields || []).every(f => !f.multiline));
			assert.equal(new Set(queue.map(q => q.meta.familyKey)).size, 10);
			if (unit === "comparison") for (const q of queue) {
				if (["rewrite-hodo", "rewrite-hou", "opposite", "repair", "meaning"].includes(q.meta.task)) {
					assert.equal(q.meta.facts.length, 1, "A direct grammar task must not become a multi-fact reading puzzle");
				}
			}
		}
	}
});

test("comparison prompts retain the operation but do not import irrelevant reading instructions", () => {
	const api = require("./comparison-practice.js"), bank = api.create({ ...input, seed: 17 }).buildBank();
	for (const source of bank) {
		const q = core.compact(source), task = q.meta.task;
		if (["production", "three-forms"].includes(task)) {
			assert.ok(q.promptLabel);
			assert.doesNotMatch(q.prompt, /[\u4e00-\u9fff\u3040-\u30ff]/, "No stray adjective or Japanese narrator in the English cue");
			assert.doesNotMatch(q.subprompt, /Use only the information|今月|先月/);
			assert.equal(q.prompt.split("\n").length, 1);
		} else if (task === "repair") {
			assert.match(q.prompt, /Draft to correct:/);
			assert.match(q.subprompt, /Correct the draft/);
			assert.equal(q.band, "Correct the draft.");
		} else if (task === "opposite") {
			assert.ok(q.instructionFocus.includes("Reverse the relationship"));
			assert.equal(q.band, "Reverse the relationship.");
		}
		const scope = q.meta.target.scope;
		if (q.subprompt.includes("Use only the information for")) assert.ok(q.prompt.includes(scope), `${q.meta.id}: missing scope ${scope}`);
	}
});

test("short interpretation tasks show the utterance, not Japanese narration of its meaning", () => {
	for (const unit of ["invitation", "ability", "experience"]) {
		const bank = require(`./${unit}-practice.js`).create({ ...input, seed: 17 }).buildBank();
		for (const q of bank) {
			assert.doesNotMatch(q.prompt, /会話はここで止まっています|Bが申し出ること|Bができること/);
			if (["reply-meaning", "scope-reading"].includes(q.meta.task)) assert.equal(q.prompt.split("\n").length, 2);
			if (["rewrite-potential", "rewrite-koto", "scope-negation"].includes(q.meta.task)) assert.equal(q.prompt.split("\n").length, 1);
		}
	}
});
