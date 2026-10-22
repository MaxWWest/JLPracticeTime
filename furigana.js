/* Word-aware display readings. Explicit {surface|reading} always wins. */
(function (root, factory) {
	const api = factory();
	if (typeof module === "object" && module.exports) module.exports = api;
	else root.Furigana = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
	"use strict";
	const kanji = /[\u3400-\u9fff々]/;
	const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
	const corrections = [
		["来ない", "こない"], ["来なかった", "こなかった"], ["来なく", "こなく"], ["来な", "こな"], ["来い", "こい"], ["来られ", "こられ"], ["来よう", "こよう"], ["来れば", "くれば"], ["来る", "くる"],
		["入る", "はいる"], ["入った", "はいった"], ["入って", "はいって"], ["入ら", "はいら"], ["入り", "はいり"], ["入れば", "はいれば"], ["入ろう", "はいろう"],
		["入れる", "いれる"], ["入れ", "いれ"],
		["人気", "にんき"], ["人間", "にんげん"], ["何時", "なんじ"], ["何人", "なんにん"], ["何分", "なんぷん"], ["何か", "なにか"],
		["一人", "ひとり"], ["二人", "ふたり"], ["三人", "さんにん"], ["四人", "よにん"], ["五人", "ごにん"],
		["勉強中", "べんきょうちゅう"], ["授業中", "じゅぎょうちゅう"], ["仕事中", "しごとちゅう"], ["使用中", "しようちゅう"], ["会議中", "かいぎちゅう"],
		["一日中", "いちにちじゅう"], ["午前中", "ごぜんちゅう"], ["午後", "ごご"], ["直後", "ちょくご"], ["直前", "ちょくぜん"],
		["十分間", "じゅっぷんかん"], ["十分前", "じゅっぷんまえ"], ["十分後", "じゅっぷんご"], ["十分です", "じゅうぶんです"],
		["楽", "らく"], ["安全", "あんぜん"], ["危険", "きけん"], ["快適", "かいてき"], ["半分", "はんぶん"], ["途中", "とちゅう"],
		["始ま", "はじま"], ["始め", "はじめ"], ["終わ", "おわ"], ["終え", "おえ"], ["続け", "つづけ"], ["残り", "のこり"],
		["分か", "わか"], ["送", "おく"], ["助か", "たすか"], ["助け", "たすけ"], ["断", "ことわ"], ["知", "し"], ["答", "こた"],
		["今回", "こんかい"], ["今度", "こんど"], ["無理", "むり"], ["次", "つぎ"], ["別", "べつ"], ["時", "とき"],
		["少し", "すこし"], ["違", "ちが"], ["一方", "いっぽう"], ["本人", "ほんにん"], ["有無", "うむ"], ["生まれ", "うまれ"],
		["必ず", "かならず"], ["結局", "けっきょく"], ["用事", "ようじ"], ["覚え", "おぼえ"], ["全く", "まったく"], ["用意", "ようい"],
		["変え", "かえ"], ["変わ", "かわ"], ["受け", "うけ"], ["状態", "じょうたい"], ["場面", "ばめん"], ["任せ", "まかせ"],
		["力", "ちから"], ["限界", "げんかい"], ["意味", "いみ"], ["耳", "みみ"], ["言葉", "ことば"], ["動き", "うごき"],
		["目", "め"], ["読書", "どくしょ"], ["過去", "かこ"], ["理由", "りゆう"], ["通常", "つうじょう"], ["寝", "ね"],
		["伝え", "つたえ"], ["正常", "せいじょう"], ["状況", "じょうきょう"], ["離れ", "はなれ"], ["運ぶ", "はこぶ"], ["運ん", "はこん"],
		["寂しい", "さびしい"], ["壊れ", "こわれ"], ["片付け", "かたづけ"], ["両方", "りょうほう"], ["反対側", "はんたいがわ"],
		["事前", "じぜん"], ["毎月", "まいつき"], ["今夜", "こんや"], ["専用", "せんよう"], ["現金", "げんきん"], ["市役所", "しやくしょ"],
		["窓口", "まどぐち"], ["売店", "ばいてん"], ["共同", "きょうどう"], ["公衆", "こうしゅう"], ["可能", "かのう"]
	];
	const digits = ["", "いち", "に", "さん", "よん", "ご", "ろく", "なな", "はち", "きゅう"];
	const characters = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
	function number(n, table, ten) { return n < 10 ? table[n] : (n < 20 ? "" : table[Math.floor(n / 10)]) + ten + table[n % 10]; }
	const counters = [];
	for (let n = 1; n < 60; n++) {
		const prefix = n < 10 ? "" : number(n - n % 10, digits, "じゅう");
		const minute = n % 10 ? prefix + ["", "いっぷん", "にふん", "さんぷん", "よんぷん", "ごふん", "ろっぷん", "ななふん", "はっぷん", "きゅうふん"][n % 10] : (n < 20 ? "" : digits[n / 10]) + "じゅっぷん";
		for (const surface of [String(n), number(n, characters, "十")]) {
			if (surface !== "十") counters.push([surface + "分", minute]);
			counters.push([surface + "分間", minute + "かん"]);
			if (n <= 24) {
				const hour = prefix + ({ 4: "よ", 7: "しち", 9: "く" }[n % 10] || digits[n % 10]) + "じ";
				counters.push([surface + "時", hour], [surface + "時間", hour + "かん"]);
			}
		}
	}
	function create(entries) {
		const map = new Map([...entries, ...counters, ...corrections].filter(([word, reading]) => kanji.test(word) && /^[ぁ-ゖァ-ヺー]+$/.test(reading)));
		// These isolated surfaces cannot choose a reading without authored context.
		for (const word of ["十分", "辛い", "辛く"]) map.delete(word);
		for (const word of map.keys()) if (word.startsWith("辛")) map.delete(word);
		const sorted = [...map].sort((a, b) => b[0].length - a[0].length);
		const segmenter = new Intl.Segmenter("ja", { granularity: "word" });
		function ruby(text, reading, explicit = false) {
			let base = text, kana = reading, suffix = "";
			if (!explicit) while (base.length > 1 && /[ぁ-ゖァ-ヺー]/.test(base.at(-1)) && base.at(-1) === kana.at(-1)) {
				suffix = base.at(-1) + suffix; base = base.slice(0, -1); kana = kana.slice(0, -1);
			}
			return { text, reading, html: `<ruby>${escape(base)}<rt>${escape(kana)}</rt></ruby>${escape(suffix)}` };
		}
		function tokens(value, { auto = true } = {}) {
			const source = String(value || ""), output = [];
			const ends = new Map(), boundaries = new Set([source.length]);
			if (auto) for (const part of segmenter.segment(source)) {
				boundaries.add(part.index);
				for (let i = part.index; i < part.index + part.segment.length; i++) ends.set(i, part.index + part.segment.length);
			}
			for (let index = 0; index < source.length;) {
				const exact = source.slice(index).match(/^\{([^{}|]+)\|([^{}|]+)\}/);
				if (exact) { output.push(ruby(exact[1], exact[2], true)); index += exact[0].length; continue; }
				const end = ends.get(index) || index + 1;
				const entry = auto && sorted.find(([word]) => source.startsWith(word, index) && (boundaries.has(index + word.length) || !kanji.test(source[index + word.length])));
				if (entry) { output.push(ruby(...entry)); index += entry[0].length; continue; }
				// An unknown compound stays intact instead of inheriting unrelated single-kanji readings.
				const text = source.slice(index, auto && kanji.test(source[index]) ? end : index + 1);
				output.push({ text, html: escape(text) }); index += text.length;
			}
			return output;
		}
		return { tokens, render: (value, options) => tokens(value, options).map(t => t.html).join("") };
	}
	return { create };
});
