(function(root, factory) {
	const api = factory();
	if (typeof module === "object" && module.exports) module.exports = api;
	else root.DrillLexicon = api;
})(typeof globalThis === "object" ? globalThis : this, function() {
	"use strict";
	// Explicit forms and compatibility edges keep lexical variation grammatical.
	const verbs = [
		["read", "読む", "よむ", "読み", "読んで", "読まない", "読んだ", "read", "図書館", "本:ほん:the book", "新聞:しんぶん:the newspaper", "雑誌:ざっし:the magazine", "小説:しょうせつ:the novel"],
		["write", "書く", "かく", "書き", "書いて", "書かない", "書いた", "write", "教室", "名前:なまえ:your name", "作文:さくぶん:the essay", "手紙:てがみ:the letter", "日記:にっき:the diary entry"],
		["use", "使う", "つかう", "使い", "使って", "使わない", "使った", "use", "教室", "辞書:じしょ:the dictionary", "パソコン:ぱそこん:the computer", "スマホ:すまほ:the phone", "カメラ:かめら:the camera"],
		["bring", "持ってくる", "もってくる", "持ってき", "持ってきて", "持ってこない", "持ってきた", "bring", "学校", "弁当:べんとう:a packed lunch", "水:みず:water", "ノート:のーと:a notebook", "傘:かさ:an umbrella"],
		["borrow", "借りる", "かりる", "借り", "借りて", "借りない", "借りた", "borrow", "受付", "地図:ちず:the map", "ペン:ぺん:the pen", "自転車:じてんしゃ:the bicycle", "かばん:かばん:the bag"],
		["eat", "食べる", "たべる", "食べ", "食べて", "食べない", "食べた", "eat", "食堂", "パン:ぱん:the bread", "おにぎり:おにぎり:the rice ball", "ケーキ:けーき:the cake", "サンドイッチ:さんどいっち:the sandwich"],
		["buy", "買う", "かう", "買い", "買って", "買わない", "買った", "buy", "店", "切符:きっぷ:the ticket", "お土産:おみやげ:the souvenir", "靴:くつ:the shoes", "時計:とけい:the watch"],
		["send", "送る", "おくる", "送り", "送って", "送らない", "送った", "send", "事務所", "メール:めーる:the email", "写真:しゃしん:the photo", "資料:しりょう:the materials", "荷物:にもつ:the parcel"]
	];
	const readings = [["図書館","としょかん"],["教室","きょうしつ"],["学校","がっこう"],["受付","うけつけ"],["食堂","しょくどう"],["事務所","じむしょ"],["店","みせ"],["私","わたし"],["妹","いもうと"],["弟","おとうと"],["兄","あに"],["姉","あね"],["田中","たなか"],["山田","やまだ"],["先生","せんせい"]];
	const actions = verbs.flatMap(([domain, verb, kana, stem, te, nai, ta, englishVerb, place, ...words]) => {
		readings.push([verb, kana]);
		// Readings are authored by surface form, not guessed from kanji length.
		const forms = {
			read: ["よみ","よんで","よまない","よんだ"], write: ["かき","かいて","かかない","かいた"],
			use: ["つかい","つかって","つかわない","つかった"], bring: ["もってき","もってきて","もってこない","もってきた"],
			borrow: ["かり","かりて","かりない","かりた"], eat: ["たべ","たべて","たべない","たべた"],
			buy: ["かい","かって","かわない","かった"], send: ["おくり","おくって","おくらない","おくった"]
		}[domain];
		[stem,te,nai,ta].forEach((form,i) => readings.push([form,forms[i]]));
		readings.push([nai.slice(0,-1),forms[2].slice(0,-1)]);
		return words.map(word => {
			const [noun, reading, en] = word.split(":"); readings.push([noun,reading]);
			return { id: `${domain}:${noun}`, domain, noun, reading, en, verb, stem, te, nai, ta, place,
				prefix: `${noun}を`, dict: `${noun}を${verb}`, actionEn: `${englishVerb} ${en}`, words: [noun,verb] };
		});
	});
	return { actions, readings };
});
