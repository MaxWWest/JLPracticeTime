const test = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./reading-test-runtime.js");
const quality = require("./reading-quality.js");
const skills = require("./reading-skills.js");
const content = require("./reading-content.js");

test("two new modes contain 80 original questions, exact highlights, and four unique choices", () => {
	assert.equal(skills.references.length, 20);
	assert.equal(skills.connections.length, 60);
	const ids = new Set();
	for (const q of [...skills.references, ...skills.connections]) {
		assert.ok(!ids.has(q.id)); ids.add(q.id);
		assert.equal(new Set(q.options).size, 4, q.id);
		assert.equal(q.options.filter(value => value === q.answer).length, 1);
		assert.ok(q.explanation.length > 50);
		if (q.target) assert.equal(q.text.slice(q.targetStart, q.targetStart + q.target.length), q.target);
	}
	assert.equal(skills.references.filter(q => q.type === "forward").length, 4);
	const opinion = skills.references.find(q => q.id === "reference-agree-plan");
	assert.equal(opinion.targetStart, opinion.text.indexOf("そう思います"));
	assert.notEqual(opinion.targetStart, opinion.text.indexOf("そう"));
	assert.equal(new Set(skills.connections.map(q => q.sourceId)).size, 20);
	for (const mode of [skills.references, skills.connections]) {
		const round = content.selectSession(mode, 20);
		assert.equal(new Set(round.map(q => q.sourceId)).size, 20);
	}
});

test("connectors do not offer synonyms or overlapping relation labels as competing answers", () => {
	for (const q of skills.connections) {
		if (q.type === "connector") {
			if (q.answer === "または") assert.ok(!q.options.includes("しかし"), q.id);
			for (const pair of [["それで", "だから"], ["しかし", "でも"], ["また", "それに"]]) {
				assert.ok(pair.filter(word => q.options.includes(word)).length <= 1, q.id);
			}
		}
		if (q.type === "relationship") {
			for (const group of [["Contrast / concession", "Opposing comparison"], ["Cause → result", "Triggered response", "Next event"]]) {
				assert.ok(group.filter(label => q.options.includes(label)).length <= 1, q.id);
			}
		}
	}
});

test("all 74 break sentences have authored roles; cause and continuing state are not guessed as sequence", () => {
	const api = load();
	assert.equal(api.breakBank.length, 74);
	assert.equal(quality.breakRoles.length, 74);
	for (const item of api.breakBank) {
		assert.equal(item.roles.length, item.breaks.length, item.text);
		for (const position of item.breaks) {
			const role = api.classifyBreakRole(item, position);
			assert.ok(role?.label && role?.explanation, item.text);
			assert.ok(api.breakRoleOptions(role.label).includes(role.label));
		}
	}
	assert.equal(api.breakBank[53].roles[0].label, "Reason / cause");
	assert.equal(api.breakBank[72].roles[0].label, "Continuing state");
	assert.equal(api.breakBank[40].roles[0].label, "Time / sequence");
});

test("all 56 quotes have authored source, reporting act and force; critical distinctions stay separate", () => {
	const api = load();
	assert.equal(api.quoteBank.length, 56);
	for (const item of api.quoteBank) {
		assert.ok(item.analysis, item.text);
		assert.ok(api.quoteReporter(item));
		assert.ok(item.text.slice(item.end).startsWith("と"), item.text);
		assert.ok(api.quoteChoiceOptions(api.quoteForceInfo(item).label, api.quoteForceChoices).includes(api.quoteForceInfo(item).label));
	}
	assert.equal(api.quoteReporter(api.quoteBank[0]), "友だち");
	assert.equal(api.quoteReporter(api.quoteBank[5]), "先生");
	assert.equal(api.quoteReporter(api.quoteBank[6]), "田中さん");
	assert.equal(api.quoteReporter(api.quoteBank[2]), "考えた人（明示なし）");
	assert.equal(api.quoteForceInfo(api.quoteBank[22]).label, "Offer of help");
	assert.equal(api.quoteForceInfo(api.quoteBank[23]).label, "Question / permission request");
	assert.equal(api.quoteForceInfo(api.quoteBank[33]).label, "Permission / no obligation");
	assert.equal(api.quoteForceInfo(api.quoteBank[47]).label, "Permission / no obligation");
	assert.equal(api.quoteForceInfo(api.quoteBank[38]).label, "Obligation");
	assert.equal(api.quoteVerbInfo(api.quoteBank[41]).label, "wrote / was written");
	assert.equal(api.quoteForceInfo(api.quoteBank[7]).label, "Desire / wish");
});

test("answer choices never drop the correct agent after randomization", () => {
	for (let seed = 1; seed <= 100; seed++) {
		const api = load(seed);
		for (const q of [...api.buildAgentQuestionBank(), ...api.buildMoodQuestionBank()]) {
			assert.equal(q.options.filter(value => value === q.answer).length, 1, `${seed} ${q.sentence}`);
			assert.equal(new Set(q.options).size, q.options.length);
			assert.ok(!["clue", "signal"].includes(q.type || q.role));
		}
	}
});

test("mood requires context: passive, completion and favor forms do not determine polarity", () => {
	const bank = load().buildMoodQuestionBank();
	for (const example of quality.moods) {
		const q = bank.find(q => q.sentence === example.sentence && q.type === "mood");
		assert.equal(q.answer, { positive: "Positive (+)", negative: "Negative (-)", mixed: "Mixed feelings", neutral: "No attitude established" }[example.mood]);
		assert.ok(q.options.includes("No attitude established") && q.options.includes("Mixed feelings"));
	}
	const round = content.selectSession(bank, 10);
	assert.ok(round.some(q => q.balanceKey.endsWith(":neutral")));
	assert.ok(round.some(q => q.balanceKey.endsWith(":mixed")));
});

test("every approved stack has valid scope, and base/meaning tasks hide their answers", () => {
	const api = load(17);
	for (const word of quality.stackWords) {
		for (const pattern of quality.stackChains) {
			let state = api.verb(word.reading, word.type), trail = [];
			for (const letter of pattern) {
				state = api.applyTransform(state, letter, trail.length, trail);
				if (!state) break; // Ichidan passive/potential is intentionally excluded.
				assert.doesNotMatch(state.text, /undefined|null/);
				trail.push(letter);
			}
		}
		for (const length of [1, 2, 3, 4]) assert.equal(api.generateChain(api.verb(word.reading, word.type), length).length, length);
	}
	const sample = (word, pattern) => {
		let state = api.verb(word.reading, word.type), used = [];
		for (const letter of pattern) { state = api.applyTransform(state, letter, used.length, used); used.push(letter); }
		return api.kanjiForm(state.text, word);
	};
	assert.equal(sample(quality.stackWords[0], "fbad"), "書いておかなかったかもしれない");
	assert.equal(sample(quality.stackWords[11], "liba"), "説明してもらえなかった");
	assert.equal(sample(quality.stackWords[6], "cjad"), "開けたくなったかもしれない");
	for (const [focus, steps] of [["base", "3"], ["meaning", "4"]]) {
		api.document.querySelector("#rh-level").value = "N4";
		api.document.querySelector("#rh-steps").value = steps;
		api.document.querySelector("#rh-stack-focus").value = focus;
		api.document.querySelector("#rh-count-stack").value = "10";
		api.startSession("stack");
		const s = api.getSession();
		if (focus === "base") assert.ok(!api.controls.get("#rh-hero").innerHTML.includes('class="rh-from"'));
		else assert.ok(!api.controls.get("#rh-body").innerHTML.includes("<h4>Focus layer</h4>"));
		assert.ok(s.current.choiceAnswer);
	}
});
