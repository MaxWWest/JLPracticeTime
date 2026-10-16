const fs = require("node:fs");
const path = require("node:path");
const boss = require("./boss-practice.js");
const { loadGrammarRuntime } = require("./grammar-audit.js");

function preview(seed = 20261016) {
	const r = loadGrammarRuntime();
	const engine = boss.create({ nounPools: r.comparisonNounPools, verbPool: r.grammarVerbPool, aliases: r.comparisonKanaAnswerAliases, seed });
	const questions = boss.selectQueue(engine.buildBank(), 10, { seed });
	const lines = ["# Boss 01-05: Pilot Sample", "", `Deterministic preview, seed ${seed}. Ten scenario families, not an unlimited bank.`, "English passages are shown here for editorial review, not during the website quiz.", "This first pilot tests selection and interpretation; focused Review retains written production.", "", ...questions.flatMap((q, i) => [
		`## ${i + 1}. ${q.kind}`, "", q.prompt, "", `**English:** ${q.promptEnglish}`, "", q.subprompt, "",
		...q.options.map((option, j) => `${String.fromCharCode(65 + j)}. ${option}`), ""
	]), "## Answer Key", "", ...questions.flatMap((q, i) => [
		`**${i + 1}. ${String.fromCharCode(65 + q.options.indexOf(q.answer))}** (${q.meta.id})`, "", q.choiceMeanings[q.answer], "", q.explanation, ""
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
