const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const time = require("./time-practice.js");
const { loadGrammarRuntime } = require("./grammar-audit.js");
const runtime = loadGrammarRuntime();
const makeEngine = (seed) => time.create({ nounPools: runtime.comparisonNounPools, verbPool: runtime.grammarVerbPool, aliases: runtime.comparisonKanaAnswerAliases, seed });
const engine = makeEngine(20261015), bank = engine.buildBank();

test("temporal facts distinguish overlap, shared actors, sequence and exact boundaries", () => {
	const a = { actor: "A", start: 10, end: 20 };
	assert.equal(time.relationship(a, { actor: "A", start: 15, end: 25 }), "overlap");
	assert.equal(time.relationship(a, { actor: "B", start: 15, end: 25 }), "different-actors");
	assert.equal(time.relationship(a, { actor: "A", start: 20, end: 25 }), "a-first");
	assert.equal(time.relationship(a, { actor: "A", start: 5, end: 10 }), "b-first");
	assert.deepEqual([9, 10, 15, 20, 21].map((now) => time.stageAt(now, 10, 20)), ["before", "during", "during", "after", "after"]);
	assert.equal(time.meetsPlan({ finish: 20, waitStart: 20, waitEnd: 30 }, 20, 30), true);
	assert.equal(time.meetsPlan({ finish: 19, waitStart: 19, waitEnd: 30 }, 20, 30), true);
	assert.equal(time.meetsPlan({ finish: 21, waitStart: 21, waitEnd: 30 }, 20, 30), false);
	assert.equal(time.meetsPlan({ finish: 19, waitStart: 19, waitEnd: 29 }, 20, 30), false);
});

test("fact-bearing choices have exactly one supported interpretation, independent of answer keys", () => {
	for (const q of [...bank, ...time.selectQueue(bank, 25, { seed: 44 })]) {
		const f = q.meta.facts;
		let truths;
		if (q.meta.task === "overlap-report") truths = q.choiceFacts.map((claim) => claim === time.relationship(f.a, f.b));
		if (q.meta.task === "same-actor") truths = q.choiceFacts.map((claim) => time.relationship(claim.a, claim.b) === "overlap");
		if (q.meta.task === "stage-choice") truths = q.choiceFacts.map((claim) => claim === time.stageAt(f.now, f.start, f.end));
		if (q.meta.task === "feasible-plan") truths = q.choiceFacts.map((plan) => time.meetsPlan(plan, f.deadline, f.until));
		if (truths) {
			assert.equal(truths.filter(Boolean).length, 1, q.meta.id);
			assert.equal(q.options[truths.indexOf(true)], q.answer, q.meta.id);
		}
	}
});

test("all text questions assess target grammar and supply vocabulary without leaking assembled answers", () => {
	for (const q of bank) {
		assert.equal(q.meta.engine, time.version);
		assert.ok(!q.placeholder);
		assert.ok(!/adaptive|verb stem|negative adjective/i.test(q.kind));
		assert.ok(!/[一-龯]/.test(q.english), q.english);
		if (q.mode === "text") {
			assert.ok(q.fields.length);
			assert.equal(engine.grade(q, q.fields.map((f) => f.answer)).correct, true, q.meta.id);
			for (const f of q.fields) {
				assert.match(f.answer, /ながら|ところ|まで/);
				for (const answer of f.accepted) {
					const kana = engine.normalize(answer);
					assert.ok(!/[一-龯]/.test(kana), `Missing reading: ${kana}`);
					const input = q.fields.map((x) => x.answer); input[q.fields.indexOf(f)] = kana;
					assert.equal(engine.grade(q, input).correct, true);
				}
				if (f.multiline) {
					assert.ok(q.vocabulary);
					assert.ok(!engine.normalize([q.prompt, q.subprompt, q.band, q.vocabulary].join(" ")).includes(engine.normalize(f.answer)), `Leaked answer: ${q.meta.id}`);
				}
			}
		} else {
			assert.ok(q.options.length >= 3);
			assert.equal(new Set(q.options).size, q.options.length);
			assert.equal(q.options.filter((value) => engine.grade(q, value).correct).length, 1);
		}
	}
});

test("kana, polite/plain forms, clock spellings and legitimate word orders are accepted", () => {
	const change = bank.find((q) => q.meta.task === "change-limit" && q.meta.facts.boundary === "15時" && q.answer.includes("までに"));
	assert.ok(change);
	for (const value of change.fields[0].accepted) assert.equal(engine.grade(change, value.replace("15時", "十五時")).correct, true);
	assert.equal(engine.normalize("十五時までに資料を読みます。"), engine.normalize("じゅうごじまでにしりょうをよみます"));
	assert.notEqual(engine.normalize("14時"), engine.normalize("15時"));
	const combine = bank.find((q) => q.meta.task === "combine-actions");
	for (const value of combine.fields[0].accepted) assert.equal(engine.grade(combine, value).correct, true);
	const reply = bank.find((q) => q.meta.task === "stage-reply");
	assert.equal(engine.grade(reply, `私は今、${reply.answer}`).correct, true);
	assert.equal(engine.grade(reply, `昨日、${reply.answer}`).correct, false);
	assert.equal(engine.grade(combine, combine.answer.replace("ながら", "てから")).correct, false);
	assert.equal(engine.grade(change, change.answer.replace("までに", "まで")).correct, false);
	assert.equal(engine.grade(change, change.answer.replace("15時", "14時")).correct, false);
});

test("wrong stages, omitted grammar, changed actions and swapped multi-part answers are rejected", () => {
	for (const q of bank.filter((q) => q.meta.task === "stage-reply")) {
		const action = engine.lexicon.actions.find((a) => a.id === q.meta.facts.action);
		for (const stage of ["before", "during", "after"]) assert.equal(engine.grade(q, time.stageSentence(action, stage)).correct, stage === q.meta.facts.stage);
		assert.equal(engine.grade(q, q.answer.replace("ところです", "" )).correct, false);
		assert.equal(engine.grade(q, "ところです").correct, false);
	}
	const q = bank.find((q) => q.meta.task === "two-limits" && q.fields[0].answer !== q.fields[1].answer);
	assert.equal(engine.grade(q, q.fields.map((f) => f.answer).reverse()).correct, false);
	assert.deepEqual(engine.grade(q, [q.fields[0].answer, "wrong"]).parts, [true, false]);
	assert.equal(engine.grade(q, [q.fields[0].answer]).correct, false);
	assert.equal(engine.grade(q, [...q.fields.map((f) => f.answer), "extra"]).correct, false);
});

test("the two blanks and stage updates cannot be solved by memorizing a fixed answer order", () => {
	const pairs = new Set(bank.filter((q) => q.meta.task === "two-limits").map((q) => q.answer));
	assert.equal(pairs.size, 4);
	const stages = new Set(bank.filter((q) => q.meta.task === "two-updates").map((q) => q.meta.facts.moments.join("/")));
	assert.equal(stages.size, 6);
	const reports = new Set(bank.filter((q) => q.meta.task === "overlap-report").map((q) => time.relationship(q.meta.facts.a, q.meta.facts.b)));
	assert.equal(reports.size, 4);
});

test("bounded actions and meal clocks are compatible with their contexts", () => {
	for (const q of bank.filter((q) => q.meta.topic === "tokoro")) {
		const f = q.meta.facts, action = engine.lexicon.actions.find((a) => a.id === f.action);
		assert.ok(action.bounded);
		assert.ok(f.end > f.start);
		assert.equal(time.stageAt(f.now, f.start, f.end), f.stage);
		if (action.word === "朝ご飯") assert.ok(f.start < 600);
		if (action.word === "昼ご飯") assert.ok(f.start >= 660 && f.start < 840);
		if (action.word === "夕ご飯") assert.ok(f.start >= 1020);
		if (action.word === "映画") assert.ok(f.end - f.start >= 90);
		if (action.frame === "reading" && ["教科書", "小説"].includes(action.word)) assert.ok(action.object.includes("ページ"));
	}
	for (const [left, right] of time.overlapEdges) {
		assert.notEqual(left, right);
		assert.ok(!["driving", "walking"].includes(left));
	}
});

test("25-question rounds balance twelve tasks and three grammar topics without repeating a situation", () => {
	let recent = [];
	for (let seed = 0; seed < 50; seed++) {
		const queue = time.selectQueue(bank, 25, { seed, recent });
		assert.equal(queue.length, 25);
		assert.equal(new Set(queue.map((q) => q.meta.familyKey)).size, 25);
		for (const task of time.tasks) assert.equal(queue.filter((q) => q.meta.task === task.id).length, task.count, `${seed} ${task.id}`);
		for (const [topic, count] of [["nagara", 8], ["tokoro", 8], ["limits", 9]]) assert.equal(queue.filter((q) => q.meta.topic === topic).length, count);
		assert.ok(new Set(queue.flatMap((q) => q.meta.vocabulary)).size >= 17);
		queue.forEach((q, i) => { if (i) assert.notEqual(q.meta.task, queue[i - 1].meta.task); });
		if (recent.length) assert.ok(queue.filter((q) => recent.includes(q.meta.familyKey)).length <= 7);
		const positions = queue.filter((q) => q.options).map((q) => q.options.indexOf(q.answer));
		for (let i = 2; i < positions.length; i++) assert.ok(!(positions[i] === positions[i - 1] && positions[i] === positions[i - 2]));
		recent = queue.map((q) => q.meta.familyKey);
	}
});

test("all round lengths, fresh seeds, and five-item Boss slices retain topic coverage", () => {
	for (let seed = 0; seed < 20; seed++) {
		const fresh = makeEngine(seed).buildBank();
		for (const count of [5, 10, 25, 40]) {
			const queue = time.selectQueue(fresh, count, { seed });
			assert.equal(queue.length, count);
			assert.equal(new Set(queue.map((q) => q.meta.topic)).size, 3);
			assert.equal(new Set(queue.map((q) => q.meta.familyKey)).size, count);
		}
	}
});

test("actual Review and Boss routes exclude every legacy Time bank and retain Comparison", () => {
	const current = runtime.buildGrammarPracticeBank("time");
	assert.ok(current.every((q) => q.meta.engine === time.version));
	for (const focus of ["review", "boss", undefined]) {
		const queue = runtime.buildFocusedGrammarQueue("time", current, focus, 25);
		assert.equal(queue.length, 25);
		assert.ok(queue.every((q) => q.meta.engine === time.version));
	}
	const boss = runtime.buildGrammarPracticeBank("boss-01-05");
	const queue = runtime.buildFocusedGrammarQueue("boss-01-05", boss, "boss", 25).slice(0, 25);
	for (const source of ["comparison", "time", "invitation", "ability", "experience"]) assert.equal(queue.filter((q) => q.meta.sourceSessionId === source).length, 5);
	assert.ok(queue.filter((q) => q.meta.sourceSessionId === "time").every((q) => q.meta.engine === time.version));
	assert.ok(queue.filter((q) => q.meta.sourceSessionId === "comparison").every((q) => q.meta.engine === "comparison-v2"));
	assert.equal(runtime.grammarPracticeSessions["adaptive-review"], undefined);
	const html = fs.readFileSync(path.join(__dirname, "main.html"), "utf8");
	assert.ok(html.indexOf('src="time-practice.js') < html.indexOf('src="script.js'));
});
