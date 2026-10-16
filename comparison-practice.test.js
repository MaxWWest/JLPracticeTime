const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const comparison = require("./comparison-practice.js");
const { loadGrammarRuntime } = require("./grammar-audit.js");
const runtime = loadGrammarRuntime();
const makeEngine = (seed) => comparison.create({ nounPools: runtime.comparisonNounPools, adjectivePool: runtime.comparisonAdjectivePool, verbPool: runtime.grammarVerbPool, aliases: runtime.comparisonKanaAnswerAliases, seed });
const engine = makeEngine(20261014);
const bank = engine.buildBank();
const noun = (ja) => ({ ja, type: "noun" });
const difficult = { adj: "難しい", neg: "難しく" };
const quiet = { adj: "静か", neg: "静かでは" };
const writingQuestion = (more, less, dimension, form) => ({ mode: "text", fields: [{ accepted: comparison.sentenceAnswers(more, less, dimension, form) }] });

test("both comparison orders, mixed kana, punctuation and polite negative variants are accepted", () => {
	const question = writingQuestion(noun("このテスト"), noun("前のテスト"), difficult, "hou");
	for (const answer of ["このテストのほうが前のテストよりむずかしいです", "まえのテストよりこのテストの方が難しいです。", "このテストのほうが、まえのテストよりも難しいです。"])
		assert.equal(engine.grade(question, answer).correct, true, answer);
	const hodo = writingQuestion(noun("漢字"), noun("ひらがな"), difficult, "hodo");
	for (const answer of ["ひらがなはかんじほどむずかしくありません", "ひらがなは漢字ほど難しくないです。", "かんじほどひらがなはむずかしくない"])
		assert.equal(engine.grade(hodo, answer).correct, true, answer);
	const na = writingQuestion(noun("図書館"), noun("教室"), quiet, "hodo");
	for (const ending of ["ではありません", "じゃありません", "ではないです", "じゃないです", "ではない", "じゃない"])
		assert.equal(engine.grade(na, `教室はとしょかんほどしずか${ending}`).correct, true);
});

test("grading preserves direction, negation, and the distinction between nouns and actions", () => {
	const question = writingQuestion(noun("漢字"), noun("ひらがな"), difficult, "hodo");
	for (const answer of ["漢字はひらがなほど難しくありません", "ひらがなは漢字ほど難しいです", "ひらがなは漢字より難しいです", "むずかしくありません"])
		assert.equal(engine.grade(question, answer).correct, false, answer);
	const actions = writingQuestion({ ja: "図書館で勉強する", type: "action" }, { ja: "教室で勉強する", type: "action" }, difficult, "hou");
	assert.equal(engine.grade(actions, "教室で勉強するより図書館で勉強するほうが難しいです").correct, true);
	assert.equal(engine.grade(actions, "教室で勉強するより図書館で勉強するのほうが難しいです").correct, false);
	const scoped = writingQuestion(noun("電車の時間"), noun("バスの時間"), { adj: "早い", neg: "早く" }, "hou");
	assert.equal(engine.grade(scoped, "バスより電車のほうが早いです").correct, false, "Do not silently change a time comparison into a vehicle-speed comparison");
});

test("the facts distinguish transitivity, equality, missing evidence, scope, and adjective", () => {
	const fact = (more, less, options = {}) => ({ more, less, dimension: "長い", scope: "today", ...options });
	assert.equal(comparison.compare([fact("A", "B"), fact("B", "C")], "A", "C", "長い", "today"), "more");
	assert.equal(comparison.compare([fact("A", "B"), fact("C", "B")], "A", "C", "長い", "today"), "unknown");
	assert.equal(comparison.compare([fact("A", "B", { equal: true }), fact("B", "C")], "A", "B", "長い", "today"), "equal");
	assert.equal(comparison.compare([fact("A", "B"), fact("B", "C", { scope: "yesterday" })], "A", "C", "長い", "today"), "unknown");
	assert.equal(comparison.compare([fact("A", "B"), fact("B", "C", { dimension: "難しい" })], "A", "C", "長い", "today"), "unknown");
});

test("explicit correct scope is accepted without allowing a different speaker or time", () => {
	for (const structure of ["condition", "change", "perspective", "action-reason"]) {
		const q = bank.find((q) => q.meta.structure === structure && q.meta.task === "rewrite-hodo");
		const scope = q.meta.target.scope;
		const prefix = structure === "perspective" ? `${scope}には、` : structure === "action-reason" ? "私には、" : `${scope}は、`;
		assert.equal(engine.grade(q, prefix + q.fields[0].answer).correct, true);
		assert.equal(engine.grade(q, "佐藤さんには、" + q.fields[0].answer).correct, false);
	}
});

test("every generated item has an assessable grammar target and no leaked written answer", () => {
	const shapes = new Set();
	for (const q of bank) {
		assert.equal(q.meta.engine, comparison.version);
		assert.ok(!/chunk blank|contextual blank|adaptive|negative adjective ending/i.test(q.kind));
		assert.ok(!q.placeholder, q.meta.id);
		assert.ok(!/ですからです|ですだから|いだから/.test(q.prompt), `Malformed reason clause: ${q.prompt}`);
		assert.ok(!/[一-龯]/.test(q.english), `Untranslated English preview: ${q.english}`);
		if (q.mode === "text") {
			assert.ok(q.fields.length);
			assert.equal(engine.grade(q, q.fields.map((f) => f.answer)).correct, true, q.meta.id);
			for (const field of q.fields) {
				for (const answer of field.accepted) assert.ok(!/[一-龯]/.test(engine.normalize(answer)), `Missing reading: ${engine.normalize(answer)}`);
				if (!field.multiline) continue;
				assert.ok(/より|ほど/.test(field.answer), `Vocabulary-only answer: ${field.answer}`);
				assert.ok(!engine.normalize(q.prompt).includes(engine.normalize(field.answer)), `Leaked answer: ${field.answer}\n${q.prompt}`);
			}
			if (q.fields.length > 1) {
				const wrong = q.fields.map((field) => field.answer);
				wrong[0] = "wrong";
				assert.equal(engine.grade(q, wrong).correct, false);
				assert.deepEqual(engine.grade(q, wrong).parts, q.fields.map((_, i) => i !== 0));
			}
		} else {
			assert.equal(q.options.length, 4);
			assert.equal(new Set(q.options).size, 4);
			assert.equal(q.options.filter((o) => engine.grade(q, o).correct).length, 1);
			if (q.claims) {
				const truths = q.claims.map((claims) => claims.every((f) => comparison.compare(q.meta.facts, f.more, f.less, f.dimension, f.scope) === "more"));
				assert.deepEqual(truths, [true, false, false, false], `${q.kind}\n${q.prompt}`);
			}
		}
		if (q.meta.task === "paired-blanks") shapes.add(q.answer);
	}
	assert.equal(shapes.size, 6);
});

test("25-question sessions honor task quotas and prevent recycled situations and adjacent task repeats", () => {
	let recent = [];
	for (let seed = 0; seed < 60; seed++) {
		const queue = comparison.selectQueue(bank, 25, { seed, recent });
		assert.equal(queue.length, 25);
		assert.equal(new Set(queue.map((q) => q.meta.familyKey)).size, 25);
		assert.ok(new Set(queue.map((q) => q.meta.structure)).size >= 6);
		assert.ok(new Set(queue.map((q) => q.meta.adjective)).size >= 9);
		assert.ok(new Set(queue.map((q) => q.meta.domain)).size >= 12);
		const counts = Object.fromEntries(comparison.tasks.map((task) => [task.id, queue.filter((q) => q.meta.task === task.id).length]));
		for (const task of comparison.tasks) assert.equal(counts[task.id], task.count, `seed ${seed}, ${task.id}`);
		queue.forEach((q, i) => { if (i) assert.notEqual(q.meta.task, queue[i - 1].meta.task); });
		const positions = queue.filter((q) => q.mode === "choice").map((q) => q.options.indexOf(q.answer));
		for (let i = 2; i < positions.length; i++) assert.ok(!(positions[i] === positions[i - 1] && positions[i] === positions[i - 2]));
		const distribution = [0, 1, 2, 3].map((n) => positions.filter((p) => p === n).length);
		assert.ok(Math.max(...distribution) - Math.min(...distribution) <= 1);
		if (recent.length) assert.ok(queue.filter((q) => recent.includes(q.meta.familyKey)).length <= 5, "Too much overlap with previous session");
		recent = queue.map((q) => q.meta.familyKey);
	}
});

test("all offered round lengths work; seeds change the underlying scenes", () => {
	for (const count of [5, 10, 25, 40]) assert.equal(comparison.selectQueue(bank, count, { seed: count }).length, count);
	const another = makeEngine(7).buildBank();
	const keys = new Set(bank.map((q) => q.meta.sceneKey));
	assert.ok(another.filter((q) => !keys.has(q.meta.sceneKey)).length > another.length / 2);
});

test("freshly generated banks keep full rounds and grammar variety across seeds", () => {
	for (let seed = 1; seed <= 20; seed++) {
		const fresh = makeEngine(seed).buildBank();
		const queue = comparison.selectQueue(fresh, 25, { seed });
		assert.equal(queue.length, 25);
		assert.equal(new Set(queue.map((q) => q.meta.familyKey)).size, 25);
		assert.equal(new Set(queue.map((q) => q.meta.task)).size, 12);
		assert.ok(new Set(queue.map((q) => q.meta.structure)).size >= 6);
		for (const q of fresh.filter((q) => q.meta.task === "particles")) {
			assert.ok(!/ですからです|ですだから|いだから/.test(q.prompt));
			assert.match(q.prompt, /(?:い|だ)から/);
		}
	}
});

test("focused comparison routes use only the new comparison engine", () => {
	const current = runtime.buildGrammarPracticeBank("comparison");
	for (const focus of ["review", "boss", undefined]) {
		const queue = runtime.buildFocusedGrammarQueue("comparison", current, focus, 25);
		assert.equal(queue.length, 25);
		assert.ok(queue.every((q) => q.meta.engine === comparison.version));
	}
	assert.equal(runtime.grammarPracticeSessions["adaptive-review"], undefined);
	const html = fs.readFileSync(path.join(__dirname, "main.html"), "utf8");
	assert.ok(html.indexOf('src="comparison-practice.js') < html.indexOf('src="script.js'));
});
