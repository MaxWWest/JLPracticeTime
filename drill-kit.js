/* Shared question mechanics; the lesson modules own Japanese meanings and forms. */
(function(root, factory) {
	if (typeof module === "object" && module.exports) module.exports = factory(require("./grammar-practice-core.js"));
	else root.DrillKit = factory(root.GrammarPracticeCore);
})(typeof globalThis === "object" ? globalThis : this, function(core) {
	"use strict";
	const version = unit => `${unit}-meaning-v1`;
	function make(unit, task, topic, scene, variant, content, facts = {}) {
		const q = core.question(version(unit), unit, [{ id: task, label: content.kind || "Complete the meaning", topic }], task,
			{ id: `${unit}:${scene.id}`, frame: scene.domain || topic, words: scene.words || [scene.id] }, variant, content, facts);
		if (q.fields) q.meta.answerMode = "cloze";
		return q;
	}
	function cloze(unit, task, topic, scene, variant, prompt, rows, explanation, facts = {}, instruction = "Complete the sentence to match the meaning.") {
		return make(unit, task, topic, scene, variant, { prompt, ...core.cloze(rows, instruction), explanation }, facts);
	}
	function choice(unit, task, topic, scene, variant, prompt, options, answer, explanation, facts = {}, subprompt = "Which interpretation is supported?") {
		return make(unit, task, topic, scene, variant, { kind: "Interpret the grammar", prompt, subprompt, band: subprompt, options, answer, explanation,
			choiceFeedback: Object.fromEntries(options.filter(o => o !== answer).map(o => [o, `That changes the stated meaning. ${explanation}`])) }, facts);
	}
	function select(unit, bank, count = 25, options = {}) {
		const eligible = bank.filter(q => q.meta?.sourceSessionId === unit && q.meta.engine === version(unit));
		const ids = core.unique(eligible.map(q => q.meta.task));
		const tasks = ids.map(id => ({ id, count: 25 / ids.length }));
		return core.selectQueue(eligible, count, options, version(unit), tasks).map(q => core.compact({ ...q, responseSpec: q.fields ? { fields: q.fields, responseRows: q.responseRows, subprompt: q.subprompt, band: q.band } : undefined }, options.seed));
	}
	function engine(buildBank, readings, aliases = []) {
		const normalize = core.normalizer([...aliases, ...readings]);
		return { buildBank, normalize, grade: core.grader(normalize) };
	}
	return { ...core, version, make, cloze, choice, select, engine };
});
