/* Shared mechanics for fact-based lessons. Grammar rules stay in the lesson modules. */
(function (root, factory) {
	const api = factory();
	if (typeof module === "object" && module.exports) module.exports = api;
	else root.GrammarPracticeCore = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
	"use strict";
	const unique = (values) => [...new Set(values)];
	function random(seed) {
		let n = seed >>> 0;
		return () => { n += 0x6D2B79F5; let t = Math.imul(n ^ n >>> 15, n | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
	}
	function shuffle(values, rng) {
		const copy = [...values];
		for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
		return copy;
	}
	const pick = (values, rng) => values[Math.floor(rng() * values.length)];
	function normalizer(aliases) {
		const map = new Map(aliases);
		const pattern = new RegExp([...map.keys()].filter(Boolean).sort((a, b) => b.length - a.length).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
		return (value) => String(value ?? "").normalize("NFKC").replace(pattern, (word) => map.get(word)).replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/[\s。、，,.!?！？「」『』"'()（）]/g, "").toLowerCase();
	}
	function field(label, accepted, contrasts = []) {
		return { label, accepted: unique(accepted), answer: accepted[0], multiline: true, contrasts };
	}
	function gap(label, accepted, options) {
		return { ...field(label, accepted), multiline: false, ...(options ? { options: unique(options) } : {}) };
	}
	// Only remove an authored, fixed frame prefix, never infer Japanese boundaries.
	function tailField(source, prefix, options) {
		const tails = (answers) => unique(answers.filter((answer) => answer.startsWith(prefix)).map((answer) => answer.slice(prefix.length).replace(/。$/, "")));
		const accepted = tails(source.accepted);
		if (!accepted.length) throw new Error(`No answers match frame: ${prefix}`);
		return { ...gap(source.label, accepted, options), contrasts: (source.contrasts || []).map((contrast) => ({ ...contrast, accepted: tails(contrast.accepted) })) };
	}
	function cloze(rows, subprompt, band = "Complete the blanks.") {
		const fields = [];
		const responseRows = rows.map((row) => ({ label: row.label, segments: row.segments.map((part) => {
			if (typeof part === "string") return part;
			if (!part.accepted?.length || !part.answer) throw new Error("A grammar gap needs checked answers");
			if (part.options && (!part.options.includes(part.answer) || part.options.length < 2)) throw new Error("A choice gap needs its checked answer and a contrast");
			const index = fields.push(part) - 1;
			return { field: index };
		}) }));
		return { fields, responseRows, subprompt, band };
	}
	function completeResponse(question, values = question.fields.map((f) => f.answer)) {
		return question.responseRows.map((row) => row.segments.map((part) => typeof part === "string" ? part : (values[part.field] || "＿＿")).join("")).join("\n");
	}
	function compact(question, seed = Date.now()) {
		if (!question.responseSpec) return question;
		const rng = typeof seed === "function" ? seed : random(seed);
		const result = { ...question, ...question.responseSpec, meta: { ...question.meta, answerMode: "cloze" } };
		result.fields = result.fields.map((f) => f.options ? { ...f, options: shuffle(f.options, rng) } : f);
		result.answer = result.fields.map((f) => f.answer).join(" / ");
		result.accepted = [result.answer];
		return result;
	}
	function grader(normalize) {
		return (question, value) => {
			if (question.mode === "choice") return { correct: value === question.answer, parts: [], feedback: value === question.answer ? [] : [question.choiceFeedback?.[value]].filter(Boolean) };
			const input = Array.isArray(value) ? value : [value];
			const parts = question.fields.map((f, i) => f.accepted.some((a) => normalize(a) === normalize(input[i])));
			const feedback = question.fields.map((f, i) => {
				if (parts[i]) return null;
				const known = (f.contrasts || []).find((c) => c.accepted.some((a) => normalize(a) === normalize(input[i])));
					const offered = f.options?.find(option => normalize(option) === normalize(input[i]));
					const message = known?.message || (offered !== undefined
						? f.optionFeedback?.[offered] || `“${offered}” does not express the requested meaning. ${question.explanation || "Compare the role, polarity, and timing with the model."}`
						: "This wording is not among the checked answers. Compare the people, time, and meaning with the model; an unmatched answer is not automatically bad Japanese.");
					return `${f.label}: ${message}`;
			}).filter(Boolean);
			return { correct: input.length === question.fields.length && parts.every(Boolean), parts, feedback };
		};
	}
	function question(version, unit, tasks, taskId, action, variant, content, facts = {}) {
		const task = tasks.find((t) => t.id === taskId);
		const q = { kind: task.label, ...content, meta: { engine: version, sourceSessionId: unit, task: taskId, topic: task.topic, pattern: task.pattern || task.topic, difficulty: "hard", structure: taskId, domain: action.frame, vocabulary: action.words || [action.word, action.verb], familyKey: action.id, sceneKey: `${action.id}:${variant}`, id: `${taskId}:${action.id}:${variant}`, facts } };
		q.mode = q.fields ? "text" : "choice";
		if (q.fields) { q.answer = q.fields.map((f) => f.answer).join(" / "); q.accepted = [q.answer]; }
		else if (!q.options?.includes(q.answer) || unique(q.options).length !== q.options.length) throw new Error(`Invalid choices: ${q.meta.id}`);
		return q;
	}
	function interleave(items, key) {
		if (items.every((item, i) => !i || key(item) !== key(items[i - 1]))) return [...items];
		const groups = new Map();
		for (const item of items) {
			const id = key(item);
			if (!groups.has(id)) groups.set(id, []);
			groups.get(id).push(item);
		}
		const result = [];
		while (result.length < items.length) {
			const remaining = [...groups].filter(([, group]) => group.length).sort((a, b) => b[1].length - a[1].length);
			const next = remaining.find(([id]) => !result.length || id !== key(result.at(-1))) || remaining[0];
			result.push(next[1].shift());
		}
		return result;
	}
	function reviewBalancePenalty(question, queue, count) {
		// Short Review rounds must not spend most of their slots on reading-only choices.
		return count >= 10 && question.mode === "choice" && queue.filter((q) => q.mode === "choice").length >= Math.floor(count / 3) ? 100000 : 0;
	}
	function selectQueue(bank, count, { seed = Date.now(), recent = [] } = {}, version, tasks) {
		const rng = random(seed), candidates = shuffle(bank.filter((q) => q.meta?.engine === version), rng);
		const queue = [], used = new Set(), history = new Set(recent);
		const usage = { task: new Map(), topic: new Map(), domain: new Map(), vocabulary: new Map() };
		const quotas = new Map(tasks.map((t) => [t.id, Math.max(1, Math.ceil(t.count * count / 25))]));
		const bump = (map, key) => map.set(key, (map.get(key) || 0) + 1);
		while (queue.length < count) {
			let best, bestScore = Infinity;
			for (const q of candidates) {
				const m = q.meta, last = queue.at(-1)?.meta;
				if (used.has(m.familyKey)) continue;
				const taskUse = usage.task.get(m.task) || 0;
				let score = (taskUse >= quotas.get(m.task) ? 10000 : 0) + taskUse / quotas.get(m.task) * 100;
				score += reviewBalancePenalty(q, queue, count);
				score += (usage.topic.get(m.topic) || 0) * 20 + (usage.domain.get(m.domain) || 0) * 12;
				if (last?.task === m.task) score += 600;
				if (last?.topic === m.topic) score += 80;
				if (last?.domain === m.domain) score += 70;
				if (history.has(m.familyKey)) score += 500;
				score += m.vocabulary.reduce((sum, word) => sum + (usage.vocabulary.get(word) || 0) * 12, 0);
				if (score < bestScore) { best = q; bestScore = score; }
			}
			if (!best) break;
			queue.push({ ...best, options: best.options ? [...best.options] : undefined }); used.add(best.meta.familyKey);
			for (const key of ["task", "topic", "domain"]) bump(usage[key], best.meta[key]);
			for (const word of best.meta.vocabulary) bump(usage.vocabulary, word);
		}
		const counts = new Map(); let last = -1, run = 0;
		for (const q of queue.filter((q) => q.options)) {
			const facts = q.choiceFacts ? new Map(q.options.map((option, i) => [option, q.choiceFacts[i]])) : null;
			const positions = counts.get(q.options.length) || Array(q.options.length).fill(0);
			const position = shuffle(positions.map((_, i) => i), rng).filter((i) => run < 2 || i !== last).sort((a, b) => positions[a] - positions[b])[0];
			q.options = shuffle(q.options.filter((o) => o !== q.answer), rng); q.options.splice(position, 0, q.answer);
			if (facts) q.choiceFacts = q.options.map((o) => facts.get(o));
			positions[position]++; counts.set(positions.length, positions);
			run = last === position ? run + 1 : 1; last = position;
		}
		return queue;
	}
	return { random, shuffle, pick, unique, normalizer, field, gap, tailField, cloze, compact, completeResponse, grader, question, interleave, reviewBalancePenalty, selectQueue };
});
