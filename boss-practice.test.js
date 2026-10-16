const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const boss = require("./boss-practice.js");
const { loadGrammarRuntime } = require("./grammar-audit.js");
const runtime = loadGrammarRuntime();
const input = { nounPools: runtime.comparisonNounPools, verbPool: runtime.grammarVerbPool, aliases: runtime.comparisonKanaAnswerAliases, seed: 20261016 };
const engine = boss.create(input), bank = engine.buildBank();
const units = ["comparison", "time", "invitation", "ability", "experience"];

function truth(q, claim) {
	const f = q.meta.facts;
	switch (q.meta.task) {
		case "study-booking": return f.quietOrder.indexOf(claim.room) === 2 && claim.timing === "by";
		case "hotel-change": return f.prices[claim.cheaper] === Math.min(...Object.values(f.prices)) && claim.available === f.available;
		case "reading-handover": return claim.actor === f.assignee && (claim.limit === "deadline") === f.finished;
		case "kitchen-call": return claim.stage === (f.start - f.now > 60 ? "tomorrow" : f.start > f.now ? "before" : f.end > f.now ? "during" : "after");
		case "moving-help": return claim.intent === f.intent;
		case "outing-plan": return claim.day === f.acceptedDay && claim.participants === f.participants;
		case "equipment-loan": return claim.skill === f.independent && claim.usable === ((f.returnBy - f.repairEnd) * 60 >= 10);
		case "broadcast-access": return claim.access === f.registered && claim.audible === f.audibleNow;
		case "first-visit": return claim.ever === f.completed && claim.tomorrow === f.accepted;
		case "weekend-meal": return (claim.history === "never") === (f.pastCount === 0) && (claim.cheaper === "home") === (f.homeCost < f.shopCost);
		default: throw new Error(`Unreviewed case: ${q.meta.task}`);
	}
}

test("pilot is ten distinct cross-unit situations with no pre-answer grammar instructions", () => {
	assert.equal(bank.length, 40);
	assert.equal(new Set(bank.map((q) => q.meta.familyKey)).size, 10);
	for (const q of bank) {
		assert.equal(q.meta.engine, boss.version);
		assert.equal(new Set(q.meta.units).size, 2);
		assert.ok(q.meta.units.every((unit) => units.includes(unit)));
		assert.ok(q.prompt.length > 80 && q.prompt.split(/[。！？]/).length >= 3, q.meta.id);
		assert.ok(q.promptEnglish.length > 100);
		for (const english of [q.promptEnglish, ...Object.values(q.choiceMeanings)]) {
			assert.doesNotMatch(english, /\bthe the\b|[\u3040-\u30ff\u4e00-\u9fff]/i);
		}
		assert.doesNotMatch([q.kind, q.subprompt, q.band].join(" "), /より|ほう|ほど|ながら|ところ|まで|ましょう|ませんか|potential|negative|experience|use .*form/i);
		assert.ok(!q.placeholder && !q.fields);
		assert.ok(!q.prompt.includes(q.answer), q.meta.id);
		assert.equal(q.options.length, 4);
		assert.equal(new Set(q.options).size, 4);
		assert.ok(!/undefined|null/.test(JSON.stringify(q)));
	}
});

test("every choice is checked against case facts independently of the answer key", () => {
	for (const q of [...bank, ...boss.selectQueue(bank, 10, { seed: 25 })]) {
		const supported = q.choiceFacts.map((claim) => truth(q, claim));
		assert.equal(supported.filter(Boolean).length, 1, q.meta.id);
		assert.equal(q.answer, q.options[supported.indexOf(true)], q.meta.id);
		for (let i = 0; i < q.options.length; i++) assert.equal(engine.grade(q, q.options[i]).correct, supported[i]);
	}
});

test("wrong choices explain their actual meaning and the conflicting evidence", () => {
	for (const q of bank) for (const choice of q.options) {
		const result = engine.grade(q, choice);
		if (choice === q.answer) assert.deepEqual(result.feedback, []);
		else {
			assert.equal(result.feedback.length, 1);
			assert.ok(result.feedback[0].includes(q.choiceMeanings[choice]));
			assert.ok(result.feedback[0].length > q.choiceMeanings[choice].length + 50);
		}
	}
});

test("all polarity, role and stage variants can be the correct answer", () => {
	for (const spec of boss.cases) {
		const claims = bank.filter((q) => q.meta.task === spec.id).map((q) => JSON.stringify(q.choiceFacts[q.options.indexOf(q.answer)]));
		if (spec.id === "study-booking") {
			const orientations = bank.filter((q) => q.meta.task === spec.id).map((q) => q.meta.facts.quietOrder.at(-1) === q.meta.vocabulary[0]);
			assert.equal(new Set(orientations).size, 2);
		} else assert.equal(new Set(claims).size, 4, spec.id);
	}
	const handovers = bank.filter((q) => q.meta.task === "reading-handover");
	for (const q of handovers) assert.match(q.prompt, q.meta.facts.finished ? /50分に読み終えて/ : /続きは明日/);
	assert.equal(new Set(bank.filter((q) => q.meta.task === "kitchen-call").map((q) => q.choiceFacts[q.options.indexOf(q.answer)].stage)).size, 4);
	assert.equal(new Set(bank.filter((q) => q.meta.task === "moving-help").map((q) => q.answer)).size, 4);
});

test("pilot sessions cap at ten, balance the units, vary order, and rotate fact variants", () => {
	let recent = [];
	const orders = new Set(), firstAnswers = new Set();
	for (let seed = 0; seed < 100; seed++) {
		const queue = boss.selectQueue(bank, 10, { seed, recent });
		assert.equal(queue.length, 10);
		assert.equal(new Set(queue.map((q) => q.meta.familyKey)).size, 10);
		for (const unit of units) assert.equal(queue.filter((q) => q.meta.sourceSessionId === unit).length, 2);
		assert.ok(queue.every((q) => !recent.includes(q.meta.sceneKey)));
		queue.forEach((q, i) => { if (i) assert.notEqual(q.meta.sourceSessionId, queue[i - 1].meta.sourceSessionId); });
		const positions = queue.map((q) => q.options.indexOf(q.answer));
		for (let i = 2; i < positions.length; i++) assert.ok(!(positions[i] === positions[i - 1] && positions[i] === positions[i - 2]));
		const counts = [0, 1, 2, 3].map((position) => positions.filter((n) => n === position).length);
		assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
		orders.add(queue.map((q) => q.meta.sourceSessionId).join("/"));
		firstAnswers.add(queue[0].answer);
		recent = [...recent, ...queue.map((q) => q.meta.sceneKey)].slice(-30);
	}
	assert.ok(orders.size > 40);
	assert.ok(firstAnswers.size > 10);
	for (const count of [25, 40]) assert.equal(boss.selectQueue(bank, count).length, 10);
	assert.deepEqual(boss.selectQueue([], 10), []);
});

test("rebuilding changes compatible nouns without changing the finite scenario count", () => {
	const samples = new Set();
	for (let seed = 0; seed < 15; seed++) {
		const items = boss.create({ ...input, seed }).buildBank();
		assert.equal(items.length, 40);
		for (const q of items) {
			assert.equal(q.choiceFacts.filter((claim) => truth(q, claim)).length, 1);
			if (q.meta.task === "weekend-meal") assert.ok(boss.edges.meal.words.includes(q.meta.vocabulary[0]));
			if (q.meta.task === "equipment-loan") assert.ok(boss.edges.equipment.words.includes(q.meta.vocabulary[0]));
		}
		samples.add(items.map((q) => q.prompt).join("\n"));
	}
	assert.equal(samples.size, 15);
});

test("actual Boss routing excludes all Review banks, while focused reviews stay unchanged", () => {
	const versions = { comparison: "comparison-v2", time: "time-v1", invitation: "invitation-v1", ability: "ability-v1", experience: "experience-v1" };
	for (const [unit, version] of Object.entries(versions)) {
		const review = runtime.buildFocusedGrammarQueue(unit, runtime.buildGrammarPracticeBank(unit), "review", 25);
		assert.equal(review.length, 25);
		assert.ok(review.every((q) => q.meta.engine === version));
	}
	const liveBank = runtime.buildGrammarPracticeBank("boss-01-05");
	for (const focus of ["boss", "review", undefined]) {
		const queue = runtime.buildFocusedGrammarQueue("boss-01-05", liveBank, focus, 25);
		assert.equal(queue.length, 10);
		assert.ok(queue.every((q) => q.meta.engine === boss.version));
		for (const unit of units) assert.equal(queue.filter((q) => q.meta.sourceSessionId === unit).length, 2);
	}
	const otherBoss = runtime.buildGrammarPracticeBank("boss-06-10");
	assert.equal(runtime.buildFocusedGrammarQueue("boss-06-10", otherBoss, "boss", 25).slice(0, 25).length, 25);
	assert.equal(runtime.grammarPracticeSessions["adaptive-review"], undefined);
	const html = fs.readFileSync(path.join(__dirname, "main.html"), "utf8");
	assert.ok(html.indexOf('src="grammar-practice-core.js') < html.indexOf('src="boss-practice.js'));
	assert.ok(html.indexOf('src="boss-practice.js') < html.indexOf('src="script.js'));
	assert.match(html, /id="gp-count-boss-01-05"><option value="10" selected>10<\/option><\/select>/);
});

test("the inspectable pilot sample matches the current generator", () => {
	const { preview } = require("./boss-pilot-preview.js");
	assert.equal(fs.readFileSync(path.join(__dirname, "BOSS_PILOT_SAMPLE.md"), "utf8"), preview());
});

test("the audit checks the real ten-question Boss pilot without legacy augmentation", () => {
	const { buildSessionBanks, auditHardPracticeQueues } = require("./grammar-audit.js");
	const entries = buildSessionBanks(runtime, ["boss-01-05"]);
	assert.equal(entries[0].bank.length, 40);
	assert.ok(entries[0].bank.every((q) => q.meta.engine === boss.version));
	const findings = [];
	auditHardPracticeQueues(runtime, entries, findings);
	assert.deepEqual(findings, []);
	for (const queue of [[], Array(10).fill(bank[0]), bank.slice(0, 9).concat({ meta: { engine: "retired" } })]) {
		const broken = [];
		auditHardPracticeQueues({ buildFocusedGrammarQueue: () => queue }, entries, broken);
		assert.equal(broken[0]?.code, "invalid-boss-pilot");
	}
});
