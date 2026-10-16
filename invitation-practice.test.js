const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const invitation = require("./invitation-practice.js");
const { loadGrammarRuntime } = require("./grammar-audit.js");
const runtime = loadGrammarRuntime();
const makeEngine = (seed) => invitation.create({ nounPools: runtime.comparisonNounPools, verbPool: runtime.grammarVerbPool, aliases: runtime.comparisonKanaAnswerAliases, seed });
const engine = makeEngine(20261015), bank = engine.buildBank();

test("lexical frames use conjugated verbs, compatible objects and appropriate social roles", () => {
	assert.equal(engine.lexicon.actions.length, 64);
	assert.equal(new Set(engine.lexicon.actions.map((a) => a.word)).size, 56);
	for (const a of engine.lexicon.actions) {
		const frame = invitation.frames.find((f) => f.id === a.frame);
		assert.ok(frame.objects.includes(a.word));
		assert.equal(frame.verb, a.verb);
		assert.ok(a.stem.endsWith(engine.lexicon.verbs.find((v) => v.ja === a.verb).forms.masuStem));
		if (a.use !== "shared") assert.ok(a.problem);
		if (a.use !== "help") assert.ok(a.setting);
		if (a.frame === "lend") {
			assert.equal(a.use, "help");
			assert.ok(!bank.some((q) => q.meta.familyKey === a.id && ["two-intents", "context-pair", "change-actor"].includes(q.meta.task)));
		}
	}
});

test("all text tasks test intention or participants, supply vocabulary, and never leak complete answers", () => {
	for (const q of bank) {
		assert.equal(q.meta.engine, invitation.version);
		assert.ok(!q.prompt.includes("undefined"), q.meta.id);
		assert.ok(!q.placeholder);
		assert.ok(!/adaptive|verb stem|negative adjective/i.test(q.kind));
		assert.ok(!/[一-龯]/.test(q.english), q.english);
		assert.ok(!/\bon tomorrow|\bon the day after|\bon on\b/.test(q.english));
		assert.ok(!/明日に|あさってに/.test(q.prompt + (q.options || []).join("")));
		if (q.fields) {
			assert.ok(q.vocabulary);
			assert.equal(engine.grade(q, q.fields.map((f) => f.answer)).correct, true, q.meta.id);
			for (const f of q.fields) {
				assert.match(f.answer, /ませんか|ましょう/);
				assert.ok(!engine.normalize([q.prompt, q.subprompt, q.band, q.vocabulary].join(" ")).includes(engine.normalize(f.answer)), `Leaked answer: ${q.meta.id}`);
				for (const answer of f.accepted) assert.ok(!/[一-龯]/.test(engine.normalize(answer)), `Missing reading: ${answer}`);
			}
		} else {
			assert.equal(q.options.length, 4);
			assert.equal(new Set(q.options).size, 4);
			assert.equal(q.options.filter((v) => engine.grade(q, v).correct).length, 1);
		}
	}
});

test("every choice has exactly one fact-supported interpretation, including after shuffling", () => {
	for (const q of [...bank, ...invitation.selectQueue(bank, 25, { seed: 88 })].filter((q) => q.options)) {
		const f = q.meta.facts;
		const truths = q.choiceFacts.map((claim) => {
			switch (q.meta.task) {
				case "choose-reply": case "counterproposal": return claim.day === f.day && claim.actors === f.actors;
				case "scope-reading": case "reply-meaning": return claim === f.status;
				case "missing-turn": return claim === f.actors;
				case "context-pair": return claim.every((role, i) => role === f.contexts[i]);
				case "final-plan": return claim.day === f.day && claim.helper === f.helper;
				default: throw new Error(`Unverified choice type ${q.meta.task}`);
			}
		});
		assert.equal(truths.filter(Boolean).length, 1, q.meta.id);
		assert.equal(q.options[truths.indexOf(true)], q.answer, q.meta.id);
	}
});

test("shared invitations accept both natural question forms and flexible word order", () => {
	const q = bank.find((q) => q.meta.task === "invite-message" && q.meta.familyKey === "outing:公園" && q.meta.facts.first === "土曜日");
	for (const answer of ["土曜日、一緒に公園へ行きませんか。", "土曜日にいっしょに公園にいきましょうか？", "一緒に土曜日は公園へ行きませんか", "土曜日、公園に二人で行きましょうか"]) assert.equal(engine.grade(q, answer).correct, true, answer);
	for (const answer of ["土曜日、一緒に公園へ行きましょう。", "土曜日、私が公園へ行きましょうか。", "日曜日、一緒に公園へ行きませんか。", "土曜日、一緒に図書館へ行きませんか。", "行きませんか"]) assert.equal(engine.grade(q, answer).correct, false, answer);
	const tomorrow = bank.find((q) => q.meta.task === "invite-message" && q.meta.familyKey === "outing:公園" && q.meta.facts.first === "明日");
	assert.equal(engine.grade(tomorrow, "あすは一緒に公園に行きませんか").correct, true);
});

test("offers, direct acceptance and role-changing rewrites reject changed intentions", () => {
	for (const q of bank.filter((q) => q.fields && q.fields.length === 1)) {
		const answer = q.fields[0].answer;
		assert.equal(engine.grade(q, engine.normalize(answer)).correct, true);
		if (q.meta.task === "offer-message" || (q.meta.task === "change-actor" && q.meta.facts.actors === "speaker")) {
			assert.equal(engine.grade(q, answer.replace("ましょうか", "ませんか")).correct, false, q.meta.id);
			assert.equal(engine.grade(q, answer.replace("私が", "一緒に")).correct, false, q.meta.id);
		}
		if (q.meta.task === "accept-plan") {
			assert.equal(engine.grade(q, answer.replace("ましょう", "ましょうか")).correct, false);
			assert.equal(engine.grade(q, answer.replace(q.meta.facts.next, q.meta.facts.first)).correct, false);
		}
		assert.equal(engine.grade(q, answer.replace(/ませんか|ましょうか|ましょう/g, "ます")).correct, false);
	}
});

test("two-message fields independently accept kana and diagnose swapped roles", () => {
	const questions = bank.filter((q) => q.meta.task === "two-intents");
	assert.equal(new Set(questions.map((q) => q.meta.facts.intents.join("/"))).size, 2);
	for (const q of questions) {
		const input = q.fields.map((f) => engine.normalize(f.accepted.at(-1)));
		assert.equal(engine.grade(q, input).correct, true);
		assert.equal(engine.grade(q, [...input].reverse()).correct, false);
		assert.deepEqual(engine.grade(q, [input[0], "wrong"]).parts, [true, false]);
		assert.equal(engine.grade(q, [input[0]]).correct, false);
		assert.equal(engine.grade(q, [...input, "extra"]).correct, false);
	}
});

test("context answers and missing turns cannot be solved by a fixed role or keyword", () => {
	assert.match(runtime.renderJapaneseTextWithFurigana("動作"), /どうさ/);
	assert.match(runtime.renderJapaneseTextWithFurigana("行動"), /こうどう/);
	assert.equal(new Set(bank.filter((q) => q.meta.task === "context-pair").map((q) => q.meta.facts.contexts.join("/"))).size, 4);
	assert.equal(new Set(bank.filter((q) => q.meta.task === "missing-turn").map((q) => q.meta.facts.actors)).size, 2);
	for (const task of ["scope-reading", "reply-meaning"]) assert.equal(new Set(bank.filter((q) => q.meta.task === task).map((q) => q.meta.facts.status)).size, 4);
	for (const status of ["accepted", "declined"]) assert.ok(bank.some((q) => q.meta.task === "reply-meaning" && q.meta.facts.status === status && q.prompt.includes("大丈夫です")));
	assert.equal(new Set(bank.filter((q) => q.meta.task === "final-plan").map((q) => q.meta.facts.helper)).size, 2);
	assert.ok(bank.filter((q) => q.meta.familyKey.startsWith("lend:")).every((q) => q.meta.facts.status !== "together"));
});

test("25-question rounds balance twelve tasks and avoid repeating action families", () => {
	let recent = [];
	for (let seed = 0; seed < 40; seed++) {
		const queue = invitation.selectQueue(bank, 25, { seed, recent });
		assert.equal(queue.length, 25);
		assert.equal(new Set(queue.map((q) => q.meta.familyKey)).size, 25);
		for (const task of invitation.tasks) assert.equal(queue.filter((q) => q.meta.task === task.id).length, task.count, `${seed} ${task.id}`);
		assert.ok(new Set(queue.flatMap((q) => q.meta.vocabulary)).size >= 25);
		assert.ok(new Set(queue.map((q) => q.meta.domain)).size >= 10);
		queue.forEach((q, i) => { if (i) assert.notEqual(q.meta.task, queue[i - 1].meta.task); });
		if (recent.length) assert.ok(queue.filter((q) => recent.includes(q.meta.familyKey)).length <= 3);
		const positions = queue.filter((q) => q.options).map((q) => q.options.indexOf(q.answer));
		for (let i = 2; i < positions.length; i++) assert.ok(!(positions[i] === positions[i - 1] && positions[i] === positions[i - 2]));
		recent = queue.map((q) => q.meta.familyKey);
	}
});

test("five-item Boss slices and all review lengths cover intentions with fresh seeds", () => {
	for (let seed = 0; seed < 10; seed++) {
		const fresh = makeEngine(seed).buildBank();
		for (const count of [5, 10, 25, 40]) {
			const queue = invitation.selectQueue(fresh, count, { seed });
			assert.equal(queue.length, count);
			assert.equal(new Set(queue.map((q) => q.meta.topic)).size, 4);
			assert.equal(new Set(queue.map((q) => q.meta.familyKey)).size, count);
		}
	}
});

test("focused invitation routes exclude old banks; adaptive remains disabled", () => {
	const current = runtime.buildGrammarPracticeBank("invitation");
	assert.ok(current.every((q) => q.meta.engine === invitation.version));
	for (const focus of ["review", "boss", undefined]) {
		const queue = runtime.buildFocusedGrammarQueue("invitation", current, focus, 25);
		assert.equal(queue.length, 25);
		assert.ok(queue.every((q) => q.meta.engine === invitation.version));
	}
	assert.equal(runtime.grammarPracticeSessions["adaptive-review"], undefined);
	const html = fs.readFileSync(path.join(__dirname, "main.html"), "utf8");
	assert.ok(html.indexOf('src="invitation-practice.js') < html.indexOf('src="script.js'));
});
