const fs = require("node:fs");
const vm = require("node:vm");
const content = require("./reading-content.js");
const quality = require("./reading-quality.js");
const skills = require("./reading-skills.js");

const exportsCode = `globalThis.readingTestApi = {
	breakBank, quoteBank, passageBank, moodScenarios, buildAgentQuestionBank, buildMoodQuestionBank,
	classifyBreakRole, breakRoleOptions, quoteReporter, quoteVerbInfo, quoteForceInfo,
	quoteChoiceOptions, quoteForceChoices, quoteVerbChoices, generateChain, applyTransform,
	verb, kanjiForm, baseVerbLabel, stackBaseChoices, stackMeaningChoices,
	startSession, nextQuestion, checkStack, checkStackChoice, checkPassageChoice,
	checkAgentChoice, checkMoodChoice, checkBreakChoice, checkQuoteChoice, checkMarking,
	getSession: () => session, recordResult, focusReadingBank
};`;

function instrument(source) {
	return source.replace("/* ---------- Events ---------- */", `${exportsCode}\n/* ---------- Events ---------- */`);
}
function load(seed = 1) {
	const controls = new Map();
	const element = () => ({
		value: "mixed", hidden: false, textContent: "", innerHTML: "",
		addEventListener() {}, focus() {}, scrollIntoView() {},
		classList: { add() {}, remove() {}, toggle() {} },
		querySelectorAll() { return []; }
	});
	const document = {
		querySelector(selector) {
			if (!controls.has(selector)) controls.set(selector, element());
			return controls.get(selector);
		},
		querySelectorAll() { return []; }, body: element()
	};
	const seededMath = Object.create(Math);
	seededMath.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
	const shuffled = items => {
		const result = [...items];
		for (let i = result.length - 1; i > 0; i--) {
			const j = Math.floor(seededMath.random() * (i + 1));
			[result[i], result[j]] = [result[j], result[i]];
		}
		return result;
	};
	const sandbox = {
		document, Math: seededMath, window: { ReadingContent: content, ReadingQuality: quality, ReadingSkills: skills },
		localStorage: { getItem: () => null, setItem() {} }, shuffled,
		escapeHtml: value => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;")
	};
	const context = vm.createContext(sandbox);
	const app = fs.readFileSync(require.resolve("./script.js"), "utf8");
	// Exercise the actual shared inflector rather than a test implementation.
	vm.runInContext(app.slice(app.indexOf("const godanRows ="), app.indexOf("function getConjugationLevelPool")), context);
	vm.runInContext(instrument(fs.readFileSync(require.resolve("./reading.js"), "utf8")), context);
	return { ...context.readingTestApi, controls, document };
}
module.exports = { load, instrument };
