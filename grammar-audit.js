#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const scriptPath = path.join(root, "script.js");
const grammarStopMarker = "function buildFocusedGrammarQueue";
const severityRank = { high: 0, medium: 1, low: 2 };
const coreSessionLimit = 25;

function makeStubElement() {
	return new Proxy(function stubElement() {}, {
		get(_target, prop) {
			if (prop === "addEventListener") return () => {};
			if (prop === "querySelector") return () => makeStubElement();
			if (prop === "querySelectorAll") return () => [];
			if (prop === "classList") return { add() {}, remove() {}, toggle() {} };
			if (prop === "dataset") return {};
			if (prop === "style") return {};
			if (prop === "appendChild") return () => {};
			if (prop === "setAttribute") return () => {};
			if (prop === "focus") return () => {};
			if (prop === "matches") return () => false;
			if (prop === "closest") return () => null;
			if (prop === "getBoundingClientRect") return () => ({ top: 0, left: 0, bottom: 0, width: 0, height: 0 });
			if (prop === "value") return "N4";
			if (prop === "checked") return false;
			if (prop === "hidden") return true;
			return "";
		},
		set() {
			return true;
		},
		apply() {
			return makeStubElement();
		}
	});
}

function loadGrammarRuntime() {
	const fullSource = fs.readFileSync(scriptPath, "utf8");
	const stopAt = fullSource.indexOf(grammarStopMarker);
	if (stopAt === -1) throw new Error(`Could not find audit stop marker: ${grammarStopMarker}`);
	const source = `${fullSource.slice(0, stopAt)}
globalThis.__grammarAuditApi = {
	grammarPracticeSessions,
	buildAdvancedGrammarPracticeBank,
	renderJapaneseTextWithFurigana
};`;
	const document = {
		querySelector: () => makeStubElement(),
		querySelectorAll: () => [],
		createElement: () => makeStubElement(),
		addEventListener() {},
		body: makeStubElement(),
		activeElement: null
	};
	const context = {
		console,
		document,
		window: {
			addEventListener() {},
			speechSynthesis: { cancel() {}, getVoices() { return []; }, speak() {} },
			innerHeight: 1000
		},
		localStorage: { getItem() { return null; }, setItem() {}, removeItem() {} },
		fetch() { return Promise.resolve({ ok: false, json: async () => ({}) }); },
		MutationObserver: function MutationObserver() { return { observe() {} }; },
		SpeechSynthesisUtterance: function SpeechSynthesisUtterance() {},
		setTimeout,
		clearTimeout
	};
	context.globalThis = context;
	vm.runInNewContext(source, context, { filename: "script.js" });
	return context.__grammarAuditApi;
}

function hasJapanese(value) {
	return /[ぁ-んァ-ヶ一-龯]/.test(String(value || ""));
}

function normalize(value) {
	return String(value || "").replace(/[。、，,.!！？\s　「」『』"'`]/g, "").toLowerCase();
}

function clip(value, length = 130) {
	const text = String(value || "").replace(/\s+/g, " ").trim();
	return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

function questionText(question) {
	return [question.prompt, question.subprompt, question.band].filter(Boolean).join(" / ");
}

function optionText(question) {
	return (question.options || []).join(" | ");
}

function addFinding(findings, severity, code, sessionId, index, question, message, suggestion) {
	findings.push({
		severity,
		code,
		sessionId,
		index: index + 1,
		kind: question.kind || "unknown",
		prompt: clip(question.prompt),
		answer: clip(question.answer),
		message,
		suggestion
	});
}

function expectsJapaneseSentenceChoice(question) {
	const instruction = `${question.kind || ""} ${question.subprompt || ""} ${question.band || ""}`.toLowerCase();
	if (!/(japanese|sentence|equivalent|rewrite|natural|form|より|ほど|ほう|どちら|pattern)/i.test(instruction)) return false;
	if (/(meaning|nuance|diagnosis|problem|rule|explanation|why|what kind|job|function|contrast|not the main)/i.test(instruction)) return false;
	return hasJapanese(question.answer);
}

function parseYoriSentence(sentence) {
	const match = String(sentence || "").match(/^(.+?)は(.+?)より(.+?)(?:です|でした|ません|ないです|ありません|。|$)/);
	return match ? { topic: match[1], base: match[2], predicate: match[3] } : null;
}

function comparisonSignature(value) {
	const sentence = String(value || "").replace(/[「」『』]/g, "").trim();
	let match = sentence.match(/^(.+?)は(.+?)より(.+?)です。?$/);
	if (match) return `${match[2]}<${match[1]}:${match[3]}`;
	match = sentence.match(/^(.+?)より(.+?)のほうが(.+?)です。?$/);
	if (match) return `${match[1]}<${match[2]}:${match[3]}`;
	match = sentence.match(/^(.+?)は(.+?)ほど(.+?)(?:ありません|ないです)。?$/);
	if (match) return `${match[1]}<${match[2]}:${negativeStemToAdjective(match[3])}`;
	return null;
}

function negativeStemToAdjective(value) {
	const stem = String(value || "");
	if (stem.endsWith("では")) return stem.slice(0, -2);
	if (stem.endsWith("じゃ")) return stem.slice(0, -2);
	if (stem.endsWith("しく")) return `${stem.slice(0, -2)}しい`;
	if (stem.endsWith("く")) return `${stem.slice(0, -1)}い`;
	return stem;
}

function hasNonstandardHouBeforeYori(value) {
	return /[ぁ-んァ-ヶ一-龯]+のほうが[^。]*より/.test(String(value || ""));
}

function auditQuestion(sessionId, question, index, findings) {
	if (!question || typeof question !== "object") return;
	if (!question.prompt) {
		addFinding(findings, "high", "missing-prompt", sessionId, index, question, "Question has no prompt.", "Add a prompt or remove the item.");
	}
	if (!question.answer) {
		addFinding(findings, "high", "missing-answer", sessionId, index, question, "Question has no answer.", "Add an answer before shipping this item.");
	}
	if (question.mode === "choice") {
		const options = question.options || [];
		if (!Array.isArray(options) || options.length < 2) {
			addFinding(findings, "high", "choice-count", sessionId, index, question, "Choice question has fewer than two options.", "Provide at least two options, usually four.");
		}
		const normalizedOptions = options.map(normalize);
		if (!normalizedOptions.includes(normalize(question.answer))) {
			addFinding(findings, "high", "answer-not-in-options", sessionId, index, question, "Correct answer is not present in the options.", "Include the exact answer in the option pool.");
		}
		const duplicates = normalizedOptions.filter((value, optionIndex) => normalizedOptions.indexOf(value) !== optionIndex);
		if (duplicates.length) {
			addFinding(findings, "medium", "duplicate-options", sessionId, index, question, "Options contain duplicates after normalization.", "Remove duplicate distractors so the user sees distinct choices.");
		}
		const answerCopies = normalizedOptions.filter((value) => value === normalize(question.answer)).length;
		if (answerCopies > 1) {
			addFinding(findings, "high", "duplicate-correct", sessionId, index, question, "More than one option normalizes to the correct answer.", "Keep only one correct option unless the UI supports multi-answer questions.");
		}
		const answerComparison = comparisonSignature(question.answer);
		if (answerComparison) {
			const equivalentOptions = options.filter((option) => normalize(option) !== normalize(question.answer) && comparisonSignature(option) === answerComparison);
			if (equivalentOptions.length) {
				addFinding(
					findings,
					"high",
					"equivalent-comparison-option",
					sessionId,
					index,
					question,
					`Another option has the same comparison meaning as the answer: ${equivalentOptions.map(clip).join(" / ")}`,
					"Do not put より and より...のほう equivalents in the same single-answer question."
				);
			}
		}
		const houBeforeYori = [question.prompt, question.subprompt, question.band, question.answer, ...options].filter(hasNonstandardHouBeforeYori);
		if (houBeforeYori.length) {
			addFinding(findings, "medium", "nonstandard-hou-yori-order", sessionId, index, question, "Question uses のほうが before より, which is understandable but not the clean N4 drill pattern.", "Prefer AよりBのほうが... or BはAより..., especially in beginner transformation questions.");
		}
		if (expectsJapaneseSentenceChoice(question) && options.some((option) => !hasJapanese(option))) {
			addFinding(findings, "medium", "format-language-mix", sessionId, index, question, "Question asks for a Japanese sentence/form but includes a non-Japanese option.", "Move English meaning checks into a meaning-check format, or keep all options Japanese.");
		}
	}
	if (question.mode === "text") {
		const accepted = question.accepted || [question.answer];
		if (!accepted.map(normalize).includes(normalize(question.answer))) {
			addFinding(findings, "medium", "text-answer-not-accepted", sessionId, index, question, "Text answer is not included in accepted answers.", "Add the canonical answer to the accepted list.");
		}
		const textKind = `${question.kind || ""} ${question.band || ""}`;
		if (!/production|correction/i.test(textKind) && !/[＿_]/.test(`${question.prompt || ""}${question.blankPrompt || ""}`) && /blank|type|missing|complete/i.test(textKind)) {
			addFinding(findings, "low", "missing-blank-marker", sessionId, index, question, "Text completion item does not visibly show a blank.", "Add ＿＿＿＿ to the prompt if this is a fill-in question.");
		}
	}

	const text = questionText(question);
	const yori = parseYoriSentence(question.answer);
	if (yori && /which .*より|equivalent .*より|same meaning|rewrite/i.test(text)) {
		const promptContext = questionText(question);
		const usesShortHouNote = /「[^」]*のほうが[^」]*」/.test(promptContext) && !/どちら/.test(promptContext);
		const hasEnglishComparison = /\bthan\b/i.test(promptContext);
		const promptHasComparisonSet = promptContext.includes(yori.base) || /どちら/.test(promptContext) || hasEnglishComparison || new RegExp(`${yori.base}.*${yori.topic}|${yori.topic}.*${yori.base}`).test(promptContext);
		if (usesShortHouNote && !promptHasComparisonSet) {
			addFinding(
				findings,
				"high",
				"missing-comparison-anchor",
				sessionId,
				index,
				question,
				`Correct answer uses ${yori.base} as the より base, but the prompt does not establish that comparison target.`,
				`Add the comparison question/context before the short のほう answer, for example 「AとBと、どちらが...ですか」「${question.prompt || ""}」.`
			);
		}
	}
	if (/ほど/.test(question.answer || "") && !/(ません|ない|ありません|ではない|じゃない)/.test(question.answer) && /ほど/.test(`${question.kind || ""} ${question.prompt || ""}`)) {
		addFinding(findings, "medium", "hodo-positive-predicate", sessionId, index, question, "A ほど comparison answer may be missing the expected negative predicate.", "For N4 comparison, AはBほど... usually needs a negative ending.");
	}
	if (/(which|choose).{0,28}より.{0,18}sentence|equivalent.{0,18}より.{0,18}sentence/i.test(text) && hasJapanese(question.answer) && !/より/.test(question.answer)) {
		addFinding(findings, "medium", "expected-yori-answer", sessionId, index, question, "Prompt asks for a より sentence, but the answer does not contain より.", "Check whether the prompt label or correct answer is mismatched.");
	}
}

function auditFurigana(api, findings) {
	const checks = [
		{ text: "タクシーは地下鉄より高いです。", mustContain: "<ruby>地下鉄<rt>ちかてつ</rt></ruby>", mustNotContain: "<ruby>下<rt>した</rt></ruby>鉄", label: "地下鉄" },
		{ text: "辞書はノートほど軽くありません。", mustContain: "<ruby>軽く<rt>かるく</rt></ruby>", mustNotContain: "軽くありません", label: "軽く" },
		{
			text: "週末、兄は山へ行きました。私は海へ行きました。兄は『山のほうが静かだった』と言いましたが、私は海のほうが楽しかったです。",
			mustContain: [
				"<ruby>週末<rt>しゅうまつ</rt></ruby>",
				"<ruby>山<rt>やま</rt></ruby>",
				"<ruby>私<rt>わたし</rt></ruby>",
				"<ruby>楽しかった<rt>たのしかった</rt></ruby>"
			],
			mustNotContain: "山へ",
			label: "boss reading passage"
		}
	];
	for (const check of checks) {
		const rendered = api.renderJapaneseTextWithFurigana(check.text);
		const required = Array.isArray(check.mustContain) ? check.mustContain : [check.mustContain];
		if (!required.every((snippet) => rendered.includes(snippet)) || rendered.includes(check.mustNotContain)) {
			findings.push({
				severity: "high",
				code: "furigana-regression",
				sessionId: "furigana",
				index: 1,
				kind: check.label,
				prompt: clip(check.text),
				answer: clip(rendered),
				message: `${check.label} did not render with the expected full-word reading.`,
				suggestion: "Add or reorder the full word in furiganaAutoEntries so the longest match wins."
			});
		}
	}
}

function buildSessionBanks(api, requestedSessionIds) {
	const allSessionIds = Object.keys(api.grammarPracticeSessions)
		.filter((id) => !id.startsWith("family-") && !["adaptive-review", "mixed-boss", "mock-test"].includes(id))
		.slice(0, coreSessionLimit);
	const sessionIds = requestedSessionIds.length ? requestedSessionIds : allSessionIds;
	return sessionIds.map((sessionId) => {
		const session = api.grammarPracticeSessions[sessionId];
		if (!session) throw new Error(`Unknown grammar session: ${sessionId}`);
		const baseBank = session.buildBank();
		const bank = api.buildAdvancedGrammarPracticeBank(sessionId, baseBank);
		return { sessionId, title: session.title, bank };
	});
}

function parseArgs(argv) {
	const sessions = [];
	let max = 80;
	let strict = false;
	for (let index = 2; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--session" || arg === "-s") {
			sessions.push(...String(argv[index + 1] || "").split(",").filter(Boolean));
			index += 1;
		} else if (arg === "--max") {
			max = Number(argv[index + 1]) || max;
			index += 1;
		} else if (arg === "--strict") {
			strict = true;
		}
	}
	return { sessions, max, strict };
}

function main() {
	const { sessions, max, strict } = parseArgs(process.argv);
	const api = loadGrammarRuntime();
	const sessionBanks = buildSessionBanks(api, sessions);
	const findings = [];
	let totalQuestions = 0;
	for (const { sessionId, bank } of sessionBanks) {
		totalQuestions += bank.length;
		bank.forEach((question, index) => auditQuestion(sessionId, question, index, findings));
	}
	auditFurigana(api, findings);
	findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity] || a.sessionId.localeCompare(b.sessionId) || a.index - b.index);
	const counts = findings.reduce((acc, finding) => {
		acc[finding.severity] = (acc[finding.severity] || 0) + 1;
		return acc;
	}, {});
	console.log(`Audited ${totalQuestions.toLocaleString()} questions across ${sessionBanks.length} grammar session${sessionBanks.length === 1 ? "" : "s"}.`);
	console.log(`Findings: ${counts.high || 0} high, ${counts.medium || 0} medium, ${counts.low || 0} low.`);
	if (!findings.length) {
		console.log("No grammar audit findings.");
		return;
	}
	for (const finding of findings.slice(0, max)) {
		console.log(`\n[${finding.severity.toUpperCase()}] ${finding.code} · ${finding.sessionId} #${finding.index} · ${finding.kind}`);
		console.log(`Prompt: ${finding.prompt}`);
		console.log(`Answer: ${finding.answer}`);
		console.log(`Why: ${finding.message}`);
		if (finding.suggestion) console.log(`Fix: ${finding.suggestion}`);
	}
	if (findings.length > max) console.log(`\n...${findings.length - max} more finding${findings.length - max === 1 ? "" : "s"} hidden. Use --max ${findings.length} to show all.`);
	if (strict && findings.some((finding) => finding.severity === "high")) process.exitCode = 1;
}

main();
