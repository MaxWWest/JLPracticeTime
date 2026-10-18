const assert = require("node:assert/strict");
const test = require("node:test");
const { create } = require("./furigana.js");
const runtime = require("./grammar-audit.js").loadGrammarRuntime();
const render = runtime.renderJapaneseTextWithFurigana;
const ruby = (text, reading) => `<ruby>${text}<rt>${reading}</rt></ruby>`;

test("irregular verbs and inflections do not inherit a single kanji reading", () => {
	for (const [word, base, reading, tail] of [
		["来る", "来", "く", "る"], ["来ない", "来", "こ", "ない"], ["来られる", "来", "こ", "られる"], ["来ます", "来", "き", "ます"],
		["入る", "入", "はい", "る"], ["入った", "入", "はい", "った"], ["入れます", "入", "い", "れます"],
		["広かった", "広", "ひろ", "かった"], ["静か", "静", "しず", "か"]
	]) assert.equal(render(word), ruby(base, reading) + tail, word);
});

test("compounds, counters and standalone lesson nouns have checked readings", () => {
	for (const [word, reading] of [["勉強中", "べんきょうちゅう"], ["人間", "にんげん"], ["人気", "にんき"], ["何時", "なんじ"], ["三人", "さんにん"],
		["十分間", "じゅっぷんかん"], ["4時", "よじ"], ["9時", "くじ"], ["20時", "にじゅうじ"], ["3分", "さんぷん"], ["8分", "はっぷん"], ["1時間", "いちじかん"],
		["楽", "らく"], ["安全", "あんぜん"], ["声", "こえ"], ["傘", "かさ"], ["今回", "こんかい"]]) assert.equal(render(word), ruby(word, reading), word);
	assert.equal(render("部屋の中"), ruby("部屋", "へや") + "の" + ruby("中", "なか"));
});

test("unknown compounds are not decomposed into misleading single-kanji readings", () => {
	const renderer = create([["行", "い"], ["人", "ひと"], ["間", "あいだ"]]);
	assert.equal(renderer.render("行事"), "行事");
	assert.equal(renderer.render("銀行"), "銀行");
	assert.equal(render("十分"), "十分");
	assert.equal(render("辛い"), "辛い");
});

test("explicit author readings win and rendering preserves the original text safely", () => {
	assert.equal(render("{辛い|つらい}"), ruby("辛い", "つらい"));
	assert.equal(render("{辛い|からい}", { auto: false }), ruby("辛い", "からい"));
	assert.equal(render("来ない <script>", { auto: false }), "来ない &lt;script&gt;");
	const renderer = create([["静か", "しずか"]]);
	const source = "静かな場所 & < >";
	assert.equal(renderer.tokens(source).map(t => t.text).join(""), source);
	assert.equal(renderer.render("{<img>|&}"), ruby("&lt;img&gt;", "&amp;"));
});
