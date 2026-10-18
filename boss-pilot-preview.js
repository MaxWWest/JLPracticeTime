const fs = require("node:fs");
const path = require("node:path");
const boss = require("./boss-practice.js");
const { loadGrammarRuntime } = require("./grammar-audit.js");

function preview(seed = 20261016) {
	const r = loadGrammarRuntime();
	const engine = boss.create({ nounPools: r.comparisonNounPools, verbPool: r.grammarVerbPool, aliases: r.comparisonKanaAnswerAliases, seed });
	const questions = boss.selectQueue(engine.buildBank(), 10, { seed });
	const lines = ["# Boss 01-05: Sample Round", "", `Deterministic preview, seed ${seed}. Ten questions drawn from thirty scenario families (four fact variants each).`, "English passages are shown here for editorial review, not during the website quiz.", "Eight quick-response tasks lead into two one-sentence writing challenges drawn from all five units. Focused Review uses sentence frames and short blanks.", "", ...questions.flatMap((q, i) => [
		`## ${i + 1}. ${q.kind}`, "", q.prompt, "", `**English:** ${q.promptEnglish}`, "", q.subprompt, "",
		...(q.options ? q.options.map((option, j) => `${String.fromCharCode(65 + j)}. ${option}`) : [q.vocabulary, "", "[Your sentence]"]), ""
	]), "## Answer Key", "", ...questions.flatMap((q, i) => [
		`**${i + 1}. ${q.options ? String.fromCharCode(65 + q.options.indexOf(q.answer)) : q.answer}** (${q.meta.id})`, "", ...(q.choiceMeanings[q.answer] ? [q.choiceMeanings[q.answer], ""] : []), q.explanation, ""
	])];
	return lines.join("\n");
}
if (require.main === module) {
	const output = preview();
	if (process.argv.includes("--write")) {
		const file = path.join(__dirname, "BOSS_PILOT_SAMPLE.md");
		fs.writeFileSync(file, output);
		console.log(`Generated ${file}`);
	} else process.stdout.write(output);
}
module.exports = { preview };
