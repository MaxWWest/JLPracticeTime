const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ability = require("./ability-practice.js");
const experience = require("./experience-practice.js");
const { loadGrammarRuntime } = require("./grammar-audit.js");
const runtime = loadGrammarRuntime();
const input = { nounPools: runtime.comparisonNounPools, verbPool: runtime.grammarVerbPool, aliases: runtime.comparisonKanaAnswerAliases, seed: 20261016 };
const lessons = [
	{ id: "ability", api: ability, engine: ability.create(input) },
	{ id: "experience", api: experience, engine: experience.create(input) }
].map((lesson) => ({ ...lesson, bank: lesson.engine.buildBank() }));

for (const { id, api, engine, bank } of lessons) {
	test(`${id}: lexical compatibility and all generated questions satisfy the teaching contract`, () => {
		assert.ok(engine.lexicon.actions.length >= 30);
		assert.ok(new Set(engine.lexicon.actions.map((a) => a.frame)).size >= 6);
		for (const a of engine.lexicon.actions) {
			const frame = api.frames.find((f) => f.id === a.frame);
			assert.ok(frame.objects.includes(a.word));
			assert.equal(frame.verb, a.verb);
		}
		for (const q of bank) {
			assert.equal(q.meta.engine, api.version);
			assert.ok(q.prompt.length >= 50, q.meta.id);
			assert.ok(!q.placeholder);
			assert.ok(!/undefined|null/.test(JSON.stringify(q)), q.meta.id);
			assert.ok(!/adaptive|verb stem|negative adjective/i.test(q.kind));
			if (q.fields) {
				assert.ok(q.vocabulary);
				assert.equal(engine.grade(q, q.fields.map((f) => f.answer)).correct, true, q.meta.id);
				for (const f of q.fields) {
					const visible = engine.normalize([q.prompt, q.subprompt, q.band, q.vocabulary].join(" "));
					assert.ok(!visible.includes(engine.normalize(f.answer)), `Answer leak: ${q.meta.id} ${f.answer}`);
					for (const accepted of f.accepted) {
						assert.ok(!/[一-龯]/.test(engine.normalize(accepted)), `Missing reading: ${accepted} -> ${engine.normalize(accepted)}`);
						assert.ok(accepted.includes(q.meta.vocabulary[0]), `Wrong noun in answer: ${q.meta.id}`);
					}
					for (const contrast of f.contrasts) assert.ok(!contrast.accepted.some((wrong) => f.accepted.some((right) => engine.normalize(right) === engine.normalize(wrong))), `Conflicting grading: ${q.meta.id}`);
				}
				assert.equal(engine.grade(q, q.fields.map((f) => engine.normalize(f.accepted.at(-1)))).correct, true);
			} else {
				assert.equal(q.options.length, 4);
				assert.equal(new Set(q.options.map(engine.normalize)).size, 4, q.meta.id);
				assert.equal(q.options.filter((o) => engine.grade(q, o).correct).length, 1);
			}
		}
	});
	test(`${id}: balanced sessions use fresh situations, not recycled noun families`, () => {
		let recent = [];
		for (let seed = 0; seed < 30; seed++) {
			const queue = api.selectQueue(bank, 25, { seed, recent });
			assert.equal(queue.length, 25);
			assert.equal(new Set(queue.map((q) => q.meta.familyKey)).size, 25);
			for (const task of api.tasks) assert.equal(queue.filter((q) => q.meta.task === task.id).length, task.count, `${id} ${seed}: ${task.id}`);
			assert.ok(new Set(queue.map((q) => q.meta.domain)).size >= 7);
			assert.ok(new Set(queue.flatMap((q) => q.meta.vocabulary)).size >= 25);
			queue.forEach((q, i) => { if (i) assert.notEqual(q.meta.task, queue[i - 1].meta.task); });
			if (recent.length) assert.ok(queue.filter((q) => recent.includes(q.meta.familyKey)).length <= 5);
			const positions = queue.filter((q) => q.options).map((q) => q.options.indexOf(q.answer));
			for (let i = 2; i < positions.length; i++) assert.ok(!(positions[i] === positions[i - 1] && positions[i] === positions[i - 2]));
			recent = queue.map((q) => q.meta.familyKey);
		}
		for (const count of [5, 10, 40]) for (let seed = 0; seed < 8; seed++) {
			const queue = api.selectQueue(bank, count, { seed });
			assert.equal(queue.length, count);
			assert.equal(new Set(queue.map((q) => q.meta.familyKey)).size, count);
			assert.equal(new Set(queue.map((q) => q.meta.topic)).size, 4);
		}
	});
	test(`${id}: independent fields, known mistakes and unrecognized paraphrases get honest feedback`, () => {
		for (const q of bank.filter((q) => q.fields?.length > 1)) {
			const values = q.fields.map((f) => f.answer);
			assert.equal(engine.grade(q, [...values, "extra"]).correct, false);
			assert.equal(engine.grade(q, values.slice(1)).correct, false);
			assert.deepEqual(engine.grade(q, ["unrecognized", values[1]]).parts, [false, true]);
			const wrong = q.fields[0].contrasts[0];
			const result = engine.grade(q, [wrong.accepted[0], values[1]]);
			assert.equal(result.correct, false);
			assert.ok(result.feedback[0].includes(wrong.message));
			assert.match(engine.grade(q, ["unrecognized", values[1]]).feedback[0], /not automatically bad Japanese/);
		}
	});
}

test("ability: every choice has one fact-supported answer before and after option shuffling", () => {
	const { bank } = lessons[0];
	for (const q of [...bank, ...ability.selectQueue(bank, 25, { seed: 27 })].filter((q) => q.options)) {
		const facts = q.meta.facts;
		const truths = q.choiceFacts.map((claim) => {
			switch (q.meta.task) {
				case "ability-evidence": return claim.skill === facts.skill && claim.opportunity === facts.opportunity;
				case "feasible-service": return claim.ready === facts.ready && claim.operating === facts.operating;
				case "scope-change": return claim.past === facts.past && claim.now === facts.now;
				case "access-perception": return claim.access === facts.access && claim.perceived === facts.perceived;
				case "evidence-limit": return claim === facts.conclusion;
				default: throw new Error(`Unverified task ${q.meta.task}`);
			}
		});
		assert.equal(truths.filter(Boolean).length, 1, q.meta.id);
		assert.equal(q.options[truths.indexOf(true)], q.answer, q.meta.id);
	}
});

test("ability: practical conditions fit their action and service", () => {
	const { bank } = lessons[0];
	for (const q of bank.filter((q) => q.meta.task === "ability-evidence" && q.meta.domain === "language")) {
		assert.match(q.prompt, /会話する相手/);
		assert.doesNotMatch(q.prompt, /道具|材料/);
	}
	for (const q of bank.filter((q) => q.meta.task === "feasible-service")) {
		if (q.meta.familyKey === "service:洗濯") assert.match(q.prompt, /百円玉/);
		if (q.meta.familyKey === "service:練習") assert.match(q.prompt, /予約/);
		if (q.meta.familyKey === "service:食事") assert.match(q.prompt, /食券/);
	}
});

test("ability: valid object particles, kana, alternate construction and wrong polarity are distinguished", () => {
	const { engine, bank } = lessons[0];
	const q = bank.find((q) => q.meta.task === "rewrite-potential" && q.meta.familyKey === "reading:新聞" && q.meta.facts.positive);
	for (const text of ["田中さんは新聞が読めます。", "たなかさんはしんぶんをよめる", "田中さんは新聞を読めます！"]) assert.equal(engine.grade(q, text).correct, true, text);
	const wrongForm = engine.grade(q, "田中さんは新聞を読むことができます");
	assert.equal(wrongForm.correct, false);
	assert.match(wrongForm.feedback[0], /not an incorrect way/);
	assert.equal(engine.grade(q, "田中さんは新聞を読めません").correct, false);
	assert.match(engine.grade(q, "田中さんは新聞が読めません").feedback[0], /cannot/);
	assert.equal(engine.grade(q, "山田さんは新聞が読めます").correct, false);
	assert.equal(engine.grade(q, "読めます").correct, false);
	for (const task of ["two-people", "two-channels", "scope-change", "access-perception", "ability-evidence", "feasible-service"]) {
		const signatures = bank.filter((q) => q.meta.task === task).map((q) => {
			const f = q.meta.facts;
			if (task === "two-people") return f.order.map((person) => f.statuses[person]).join("/");
			if (task === "two-channels") return f.observations.join("/");
			return JSON.stringify(q.choiceFacts[q.options.indexOf(q.answer)]);
		});
		assert.equal(new Set(signatures).size, 4, task);
	}
});

test("experience: independent history, plans, event scope and unknown history support exactly one choice", () => {
	const { bank } = lessons[1];
	for (const q of [...bank, ...experience.selectQueue(bank, 25, { seed: 54 })].filter((q) => q.options)) {
		const f = q.meta.facts;
		const truths = q.choiceFacts.map((claim) => {
			switch (q.meta.task) {
				case "scope-negation": return claim === f.meaning;
				case "experience-interview": return claim.ever === f.ever && claim.planned === f.planned;
				case "specific-event": case "evidence-limit": return claim === f.conclusion;
				case "two-records": return claim.a === f.a && claim.b === f.b;
				default: throw new Error(`Unverified task ${q.meta.task}`);
			}
		});
		assert.equal(truths.filter(Boolean).length, 1, q.meta.id);
		assert.equal(q.options[truths.indexOf(true)], q.answer, q.meta.id);
	}
});

test("experience: never and occasional omission cannot normalize to the same answer", () => {
	const { bank, engine } = lessons[1];
	const never = bank.find((q) => q.meta.task === "history-report" && q.meta.familyKey === "travel:京都" && !q.meta.facts.ever);
	for (const text of ["田中さんは京都に行ったことがありません", "たなかさんはきょうとへいったことないです。", "田中さんはまだ京都に行ったことがない"]) assert.equal(engine.grade(never, text).correct, true, text);
	const occasional = "田中さんは京都に行かないことがあります";
	assert.equal(engine.grade(never, occasional).correct, false);
	assert.match(engine.grade(never, occasional).feedback[0], /occasions when it does not/);
	assert.equal(engine.grade(never, "田中さんは京都に行くことがありません").correct, false);
	assert.equal(engine.grade(never, "田中さんは京都に行きませんでした").correct, false);
	assert.equal(new Set(bank.filter((q) => q.meta.task === "scope-negation").map((q) => q.meta.facts.meaning)).size, 4);
	assert.equal(new Set(bank.filter((q) => q.meta.task === "experience-interview").map((q) => `${q.meta.facts.ever}/${q.meta.facts.planned}`)).size, 4);
	for (const q of bank.filter((q) => q.meta.task === "evidence-limit" && !q.meta.facts.ever)) assert.equal(q.meta.facts.conclusion, "unknown");
	for (const q of bank.filter((q) => q.meta.task === "timeline-update")) assert.equal(q.meta.facts.meaning, q.meta.facts.actual ? "ever" : "never");
});

test("actual Review and Boss 01-05 now exclusively use the five contextual engines", () => {
	for (const { id, api } of lessons) {
		const bank = runtime.buildGrammarPracticeBank(id);
		assert.ok(bank.every((q) => q.meta.engine === api.version));
		for (const focus of ["review", "boss", undefined]) {
			const queue = runtime.buildFocusedGrammarQueue(id, bank, focus, 25);
			assert.equal(queue.length, 25);
			assert.ok(queue.every((q) => q.meta.engine === api.version));
		}
	}
	const versions = { comparison: "comparison-v2", time: "time-v1", invitation: "invitation-v1", ability: ability.version, experience: experience.version };
	const boss = runtime.buildGrammarPracticeBank("boss-01-05");
	const queue = runtime.buildFocusedGrammarQueue("boss-01-05", boss, "boss", 25);
	assert.equal(queue.length, 25);
	for (const [id, version] of Object.entries(versions)) {
		const items = queue.filter((q) => q.meta.sourceSessionId === id);
		assert.equal(items.length, 5);
		assert.ok(items.every((q) => q.meta.engine === version));
	}
	assert.equal(runtime.grammarPracticeSessions["adaptive-review"], undefined);
	const html = fs.readFileSync(path.join(__dirname, "main.html"), "utf8");
	for (const id of ["ability", "experience"]) {
		assert.ok(html.indexOf('src="grammar-practice-core.js') < html.indexOf(`src="${id}-practice.js`));
		assert.ok(html.indexOf(`src="${id}-practice.js`) < html.indexOf('src="script.js'));
	}
});

test("comparison glossary does not include an unused third place in two-place time changes", () => {
	const bank = runtime.buildGrammarPracticeBank("comparison");
	const questions = bank.filter((q) => q.meta.structure === "change" && q.fields);
	assert.ok(questions.length);
	for (const q of questions) {
		const entries = q.vocabulary.split(" / ");
		assert.equal(entries.length, 3, q.meta.id);
		const targets = [q.meta.target.more.ja, q.meta.target.less.ja];
		for (const entry of entries.slice(0, -1)) assert.ok(targets.includes(entry.split(" (")[0]), entry);
		if (["rewrite-hodo", "rewrite-hou"].includes(q.meta.task)) for (const word of targets) assert.ok(q.prompt.includes(word));
	}
});
