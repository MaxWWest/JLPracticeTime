const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ReadingContent = require("./reading-content.js");
const { passages, buildBank, selectSession, sourceKey } = ReadingContent;

function random(seed) {
	return () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
}

function legacyBanks() {
	const controls = new Map();
	const document = {
		querySelector(selector) {
			if (!controls.has(selector)) controls.set(selector, { value: "mixed", addEventListener() {} });
			return controls.get(selector);
		}
	};
	const sandbox = { document, window: { ReadingContent, ReadingQuality: require("./reading-quality.js"), ReadingSkills: require("./reading-skills.js") }, shuffled: items => [...items], localStorage: { getItem: () => null } };
	const source = fs.readFileSync(require.resolve("./reading.js"), "utf8");
	vm.runInNewContext(source.replace(/\}\)\(\);\s*$/, "globalThis.testApi = { passageBank, buildAgentQuestionBank, buildMoodQuestionBank, breakBank, quoteBank, focusReadingBank }; })();"), sandbox);
	return { ...sandbox.testApi, controls };
}

test("12 new passages have 36 evidence-backed questions with specific distractor feedback", () => {
	assert.equal(passages.length, 12);
	const bank = buildBank(passages);
	assert.equal(bank.length, 36);
	assert.equal(new Set(bank.map(item => item.id)).size, bank.length);
	assert.equal(passages.filter(item => item.level === 1).length, 6);
	assert.equal(passages.filter(item => item.level === 2).length, 6);
	for (const item of bank) {
		assert.equal(item.options.length, 4);
		assert.equal(new Set(item.options).size, 4, item.id);
		assert.equal(item.options.filter(option => option === item.answer).length, 1);
		assert.ok(item.evidence.length);
		for (const evidence of item.evidence) assert.ok(item.text.includes(evidence), `${item.id}: missing evidence ${evidence}`);
		for (const option of item.options.filter(option => option !== item.answer)) assert.ok(item.distractorFeedback[option]?.length > 20, item.id);
		assert.ok(item.explanation.length > 30);
	}
	assert.deepEqual([...new Set(bank.map(item => item.type))].sort(), ["inference", "purpose", "reason", "reference", "sequence"]);
});

test("all bank-backed modes use distinct sources, valid choices, and capped counts", () => {
	const api = legacyBanks();
	const banks = [api.passageBank, api.buildAgentQuestionBank(), api.buildMoodQuestionBank(), api.breakBank, api.quoteBank];
	for (const bank of banks) {
		const uniqueCount = new Set(bank.map(sourceKey)).size;
		for (let seed = 1; seed <= 50; seed++) {
			const round = selectSession(bank, 50, [], random(seed));
			assert.equal(round.length, Math.min(50, uniqueCount));
			assert.equal(new Set(round.map(sourceKey)).size, round.length);
			for (const item of round) {
				if (item.options) assert.ok(item.options.includes(item.answer));
			}
		}
	}
});

test("unseen sources are used before any recently answered source", () => {
	const bank = buildBank(passages);
	const first = selectSession(bank, 10, [], random(1));
	const recent = first.map(sourceKey);
	const next = selectSession(bank, 10, recent, random(4));
	assert.ok(next.slice(0, 2).every(item => !recent.includes(sourceKey(item))));
	assert.equal(new Set(next.map(sourceKey)).size, 10);
	assert.equal(selectSession([], 10).length, 0);
});

test("mixed rounds balance skills when the source bank allows it and do not mutate data", () => {
	const bank = Array.from({ length: 12 }, (_, index) => ["inference", "reason", "reference"].map(type => ({
		sourceId: `source-${index}`, type, answer: "a", options: ["a", "b", "c", "d"]
	}))).flat();
	const before = JSON.stringify(bank);
	for (let seed = 1; seed <= 50; seed++) {
		const counts = {};
		const round = selectSession(bank, 12, [], random(seed));
		for (const item of round) counts[item.type] = (counts[item.type] || 0) + 1;
		assert.deepEqual(counts, { [round[0].type]: 4, [round[1].type]: 4, [round[2].type]: 4 });
	}
	assert.equal(JSON.stringify(bank), before);
});

test("passage focus and level filters never silently fall back to unrelated questions", () => {
	const api = legacyBanks();
	api.controls.set("#rh-passage-focus", { value: "reference" });
	api.controls.set("#rh-passage-level", { value: "2" });
	const filtered = api.focusReadingBank("passages", api.passageBank);
	assert.ok(filtered.length);
	assert.ok(filtered.every(item => item.type === "reference" && item.level === 2));
	api.controls.set("#rh-passage-level", { value: "99" });
	assert.equal(api.focusReadingBank("passages", api.passageBank).length, 0);
});
