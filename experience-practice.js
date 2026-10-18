/* Compatible actions -> history and recurrence facts -> contextual assessment. */
(function (root, factory) {
	if (typeof module === "object" && module.exports) module.exports = factory(require("./grammar-practice-core.js"));
	else root.ExperiencePractice = factory(root.GrammarPracticeCore);
})(typeof globalThis === "object" ? globalThis : this, function (core) {
	"use strict";
	const version = "experience-v1";
	const extraNouns = [
		["北海道", "ほっかいどう", "Hokkaido"], ["京都", "きょうと", "Kyoto"], ["沖縄", "おきなわ", "Okinawa"], ["大阪", "おおさか", "Osaka"], ["美術館", "びじゅつかん", "the art museum"], ["博物館", "はくぶつかん", "the museum"], ["水族館", "すいぞくかん", "the aquarium"], ["動物園", "どうぶつえん", "the zoo"],
		["旅館", "りょかん", "a Japanese inn"], ["友だちの家", "ともだちのいえ", "a friend's house"], ["祖母の家", "そぼのいえ", "my grandmother's house"], ["山の小屋", "やまのこや", "a mountain cabin"],
		["納豆", "なっとう", "natto"], ["すし", "すし", "sushi"], ["そば", "そば", "soba noodles"], ["うどん", "うどん", "udon noodles"], ["ラーメン", "らーめん", "ramen"], ["サンドイッチ", "さんどいっち", "sandwiches"], ["おにぎり", "おにぎり", "rice balls"], ["ケーキ", "けーき", "a cake"], ["紅茶", "こうちゃ", "black tea"], ["ココア", "ここあ", "cocoa"],
		["新聞", "しんぶん", "the newspaper"], ["小説", "しょうせつ", "a novel"], ["説明書", "せつめいしょ", "the instructions"], ["記事", "きじ", "an article"], ["映画", "えいが", "a film"], ["ドラマ", "どらま", "a drama"], ["試合", "しあい", "a match"], ["動画", "どうが", "a video"], ["ニュース", "にゅーす", "the news"],
		["手紙", "てがみ", "a letter"], ["日記", "にっき", "a diary entry"], ["レポート", "れぽーと", "a report"], ["メモ", "めも", "a note"], ["招待状", "しょうたいじょう", "an invitation"], ["音楽", "おんがく", "music"], ["ラジオ", "らじお", "the radio"], ["ポッドキャスト", "ぽっどきゃすと", "a podcast"], ["講演", "こうえん", "a talk"]
	];
	const readings = [
		["行動", "こうどう"], ["話題", "わだい"], ["休憩", "きゅうけい"], ["通勤", "つうきん"], ["日常", "にちじょう"], ["余暇", "よか"], ["趣味", "しゅみ"], ["移動", "いどう"], ["生活", "せいかつ"], ["調査", "ちょうさ"], ["対象", "たいしょう"],
		...extraNouns.map(([ja, kana]) => [ja, kana]), ["電車", "でんしゃ"], ["自転車", "じてんしゃ"], ["飛行機", "ひこうき"], ["新幹線", "しんかんせん"], ["船", "ふね"], ["雑誌", "ざっし"], ["教科書", "きょうかしょ"], ["作文", "さくぶん"], ["牛乳", "ぎゅうにゅう"], ["お茶", "おちゃ"],
		["行", "い"], ["泊", "と"], ["乗", "の"], ["食", "た"], ["飲", "の"], ["読", "よ"], ["見", "み"], ["作", "つく"], ["書", "か"], ["聞", "き"], ["事", "こと"], ["私", "わたし"], ["田中", "たなか"], ["山田", "やまだ"], ["佐藤", "さとう"],
		["経験", "けいけん"], ["記録", "きろく"], ["最近", "さいきん"], ["以前", "いぜん"], ["今日", "きょう"], ["昨日", "きのう"], ["予定", "よてい"], ["実際", "じっさい"], ["完了", "かんりょう"], ["中止", "ちゅうし"], ["変更", "へんこう"], ["確認", "かくにん"], ["一度", "いちど"], ["初めて", "はじめて"], ["何度", "なんど"], ["全部", "ぜんぶ"], ["毎回", "まいかい"], ["一回", "いっかい"], ["五回", "ごかい"], ["二回", "にかい"], ["三回", "さんかい"], ["機会", "きかい"], ["必要", "ひつよう"], ["習慣", "しゅうかん"], ["例外", "れいがい"], ["休み", "やすみ"], ["今まで", "いままで"], ["今も", "いまも"], ["今週", "こんしゅう"], ["週末", "しゅうまつ"], ["約束", "やくそく"], ["報告", "ほうこく"]
	];
	const frames = [
		{ id: "travel", verb: "行く", particle: "に", en: "go to", objects: ["北海道", "京都", "沖縄", "大阪", "美術館", "博物館", "水族館", "動物園"] },
		{ id: "staying", verb: "泊まる", particle: "に", en: "stay at", objects: ["ホテル", "旅館", "友だちの家", "祖母の家", "山の小屋"] },
		{ id: "transport", verb: "乗る", particle: "に", en: "ride", objects: ["自転車", "電車", "飛行機", "船", "新幹線", "タクシー", "バス"] },
		{ id: "eating", verb: "食べる", particle: "を", en: "eat", objects: ["納豆", "すし", "そば", "うどん", "ラーメン", "サンドイッチ", "カレー", "りんご"] },
		{ id: "drinking", verb: "飲む", particle: "を", en: "drink", objects: ["お茶", "コーヒー", "ジュース", "牛乳", "紅茶", "ココア"] },
		{ id: "reading", verb: "読む", particle: "を", en: "read", objects: ["新聞", "小説", "説明書", "記事", "雑誌", "教科書"] },
		{ id: "watching", verb: "見る", particle: "を", en: "watch", objects: ["映画", "ドラマ", "試合", "動画", "ニュース"] },
		{ id: "cooking", verb: "作る", particle: "を", en: "make", objects: ["カレー", "スープ", "サンドイッチ", "おにぎり", "ケーキ"] },
		{ id: "writing", verb: "書く", particle: "を", en: "write", objects: ["手紙", "日記", "レポート", "メモ", "招待状", "作文"] },
		{ id: "listening", verb: "聞く", particle: "を", en: "listen to", objects: ["音楽", "ラジオ", "ポッドキャスト", "講演", "ニュース"] }
	];
	const contexts = {
		travel: ["旅行", "長い休みになると"], staying: ["旅行中の宿泊", "旅行をするときは"], transport: ["移動の方法", "出かけるときは"],
		eating: ["食べ物", "昼ごはんには"], drinking: ["飲み物", "休憩のときは"], reading: ["読書", "寝る前には"],
		watching: ["休みの日の過ごし方", "休みの日には"], cooking: ["料理", "週末には"], writing: ["日常の活動", "時間があるときは"], listening: ["趣味", "休みの日には"]
	};
	const tasks = [
		{ id: "history-report", label: "Report the experience", topic: "history", count: 2 },
		{ id: "habit-report", label: "Describe an occasional action", topic: "recurrence", count: 3 },
		{ id: "exception-report", label: "Describe an exception", topic: "negation", count: 3 },
		{ id: "two-meanings", label: "History and habit", topic: "scope", count: 3 },
		{ id: "scope-negation", label: "Where does the negative apply?", topic: "negation", count: 2 },
		{ id: "experience-interview", label: "Experience is not today's plan", topic: "history", count: 1 },
		{ id: "specific-event", label: "Keep the event in focus", topic: "scope", count: 2 },
		{ id: "repair-claim", label: "Repair the report", topic: "history", count: 2 },
		{ id: "two-records", label: "Keep the two records separate", topic: "recurrence", count: 2 },
		{ id: "timeline-update", label: "Update after the first attempt", topic: "history", count: 2 },
		{ id: "evidence-limit", label: "What does the record establish?", topic: "scope", count: 1 },
		{ id: "change-meaning", label: "Change the intended meaning", topic: "negation", count: 2 }
	];
	const meanings = ["ever", "never", "sometimes", "sometimes-not"];
	const descriptions = {
		ever: "It has happened before; no current frequency is asserted.",
		never: "It has never happened up to now.",
		sometimes: "There are occasions when it happens.",
		"sometimes-not": "There are occasions when it does not happen; this does not mean never."
	};
	function sentences(a, meaning, person = "") {
		const action = meaning === "ever" || meaning === "never" ? a.ta : meaning === "sometimes-not" ? a.nai : a.dict;
		const particles = meaning === "sometimes" || meaning === "sometimes-not" ? ["が", "も"] : ["が", ""];
		const endings = meaning === "never" ? ["ありません。", "ないです。", "ない。"] : ["あります。", "ある。"];
		const prefixes = person ? [`${person}は`] : ["", "私は"];
		const adverbs = meaning === "ever" ? ["", "今までに"] : meaning === "never" ? ["", "今まで", "まだ", "一度も", "今まで一度も"] : ["", "ときどき", "たまに"];
		return core.unique(prefixes.flatMap((prefix) => adverbs.flatMap((adverb) => particles.flatMap((particle) => endings.map((end) => `${prefix}${adverb}${action}こと${particle}${end}`)))).flatMap((s) => [s, ...(a.verb === "行く" ? [s.replace(a.word + "に", a.word + "へ")] : [])]));
	}
	function create({ nounPools = {}, verbPool = [], aliases = [], seed = Date.now() } = {}) {
		const rng = core.random(seed), nouns = new Map(Object.values(nounPools).flat().map((n) => [n.ja, n]));
		extraNouns.forEach(([ja, kana, en]) => nouns.set(ja, { ja, kana, en }));
		const verbs = new Map(verbPool.map((v) => [v.ja, v]));
		const normalize = core.normalizer([...aliases, ...readings]), grade = core.grader(normalize);
		const actions = frames.flatMap((frame) => frame.objects.map((word) => {
			const noun = nouns.get(word), verb = verbs.get(frame.verb);
			if (!noun || !verb) throw new Error(`Missing experience vocabulary: ${word}/${frame.verb}`);
			const prefix = word + frame.particle;
			return { id: `${frame.id}:${word}`, frame: frame.id, word, verb: frame.verb, dict: prefix + verb.forms.dictionary, ta: prefix + verb.forms.ta, nai: prefix + verb.forms.nai, masu: prefix + verb.forms.masu, past: prefix + verb.forms.masuStem + "ました", negative: prefix + verb.forms.masuStem + "ません", en: `${frame.en} ${noun.en}` };
		}));
		function q(task, a, v, content, facts) {
			const item = core.question(version, "experience", tasks, task, a, v, content, facts);
			if (item.fields) {
				const rows = item.fields.map((f, i) => {
					const person = task === "two-meanings" && facts.order[i] === "routine" ? facts.other : facts.person;
					const prefix = person + "は" + a.word + frames.find((frame) => frame.id === a.frame).particle;
					const options = meanings.map((meaning) => sentences(a, meaning, person)[0].slice(prefix.length).replace(/。$/, ""));
					const label = task === "two-meanings" ? f.label : "Report";
					return { label, segments: [prefix, { ...core.tailField(f, prefix, options), label }, "。"] };
				});
				const instruction = task === "change-meaning" ? `Change the statement to this meaning: ${descriptions[facts.meaning]}` : task === "two-meanings" ? "Keep each person's experience or occasional pattern separate." : task === "repair-claim" ? "Correct the draft's claim using the account above." : "Complete the report for the time and meaning established above.";
				item.responseSpec = core.cloze(rows, instruction);
				if (["habit-report", "exception-report"].includes(task)) item.responseSpec.kind = "Report the current pattern";
			}
			return item;
		}
		const vocabulary = (a) => `${a.word} (${nouns.get(a.word).en}) / ${a.verb} (${verbs.get(a.verb).en})`;
		const field = (a, meaning, person, label) => core.field(label, sentences(a, meaning, person), meanings.filter((m) => m !== meaning).map((m) => ({ accepted: sentences(a, m, person), message: `Your sentence means: ${descriptions[m]} The requested meaning is: ${descriptions[meaning]}` })));
		const history = (a, person, ever) => `${person}：「${ever ? `前に一度、${a.past}。` : `今まで一度も${a.negative}でした。`}」`;
		const habit = (a, person, omitted = false) => `${person}：「${contexts[a.frame][1]}${omitted ? `ふつうは${a.masu}。でも、忙しいときは${a.negative}。` : `${a.masu}。ただし毎回ではありません。`}」`;
		function buildQuestions(a, v) {
			const ever = v % 2 === 0, planned = v < 2, person = v < 2 ? "田中さん" : "山田さん", other = person === "田中さん" ? "山田さん" : "田中さん";
			const meaning = meanings[v], historyMeaning = ever ? "ever" : "never", routineMeaning = planned ? "sometimes" : "sometimes-not";
			const setup = `${contexts[a.frame][0]}について話しています。今回の話題は「${a.dict}」です。`;
			const summary = history(a, person, ever);
			const fields = v % 2 ? ["routine", "history"] : ["history", "routine"];
			const types = { history: historyMeaning, routine: routineMeaning };
			const subject = { history: person, routine: other };
			const interviewClaims = [{ ever: true, planned: true }, { ever: true, planned: false }, { ever: false, planned: true }, { ever: false, planned: false }];
			const interviewText = (f) => `${sentences(a, f.ever ? "ever" : "never")[0]}今日は${f.planned ? a.masu : a.negative}。`;
			const recordClaims = [{ a: true, b: true }, { a: true, b: false }, { a: false, b: true }, { a: false, b: false }];
			const record = { a: planned, b: ever };
			const recordText = (f) => `${person}は${f.a ? "ふだんはするが、しないときもある" : "今まで一度も経験していない"}。${other}は${f.b ? "ふだんはするが、しないときもある" : "今まで一度も経験していない"}。`;
			const actual = v % 2 === 0;
			const specificOptions = [`昨日、${actual ? a.past : a.negative + "でした"}。`, sentences(a, "sometimes")[0], sentences(a, "never")[0], `昨日、${actual ? a.negative + "でした" : a.past}。`];
			const evidence = ever ? "at-least-once" : "unknown";
			const evidenceLabels = { "at-least-once": "少なくとも一度は経験している。", unknown: "この記録だけでは、今までの経験の有無は分からない。", never: "生まれてから今まで、一度も経験していない。", daily: "今も毎日、必ずしている。" };
			const changed = v % 2 ? "never" : "sometimes-not";
			const facts = { action: a.id, person, other, ever, planned };
			return [
				q("history-report", a, v, { prompt: summary, subprompt: `Summarize ${person}'s experience up to now using たことがあります or its negative. Include their name and the action.`, band: "Report the lifetime experience, not today's plan.", vocabulary: vocabulary(a), fields: [field(a, historyMeaning, person, "Experience summary")], explanation: "A completed past action before こと establishes experience. Negating あります means there has been no such experience up to now; it is different from sometimes not doing it." }, { ...facts, meaning: historyMeaning }),
				q("habit-report", a, v, { prompt: habit(a, person), subprompt: `Describe ${person}'s occasional action using ことがあります (こともあります is also accepted). Include their name.`, band: "Describe what happens on some occasions.", vocabulary: vocabulary(a), fields: [field(a, "sometimes", person, "Current habit")], explanation: "Dictionary form + ことがあります describes occasional occurrence. たことがあります would shift the statement to past experience, rather than report the habit requested here." }, { ...facts, meaning: "sometimes" }),
				q("exception-report", a, v, { prompt: habit(a, person, true), subprompt: `Explain the occasional omission using ことがあります or こともあります. Include ${person}'s name.`, band: "Sometimes not, not never.", vocabulary: vocabulary(a), fields: [field(a, "sometimes-not", person, "Occasional exception")], explanation: "The negative belongs before こと: Vないことがあります. It says the action is omitted on some occasions, not that the person has never done it." }, { ...facts, meaning: "sometimes-not" }),
				q("two-meanings", a, v, { prompt: `${setup}\n${history(a, person, ever)}\n一方、${habit(a, other, !planned)}`, subprompt: "Write each requested meaning separately using a こと construction. Include the named person in each sentence. Field order changes.", band: "Keep experience and recurrence separate.", vocabulary: vocabulary(a), fields: fields.map((type) => field(a, types[type], subject[type], `${subject[type]}: ${type === "history" ? "experience up to now" : "current occasional pattern"}`)), explanation: "The two people answer different questions. One reports whether an experience has ever occurred; the other reports what sometimes happens or does not happen." }, { ...facts, order: fields, meanings: types }),
				q("scope-negation", a, v, { prompt: sentences(a, meaning, person)[0], subprompt: "Which interpretation preserves the verb form and the scope of the negative, without adding a frequency claim?", band: "Choose the precise reading.", options: meanings.map((m) => descriptions[m]), answer: descriptions[meaning], choiceFacts: meanings, choiceFeedback: Object.fromEntries(meanings.filter((m) => m !== meaning).map((m) => [descriptions[m], `That describes ${m}. The sentence instead means: ${descriptions[meaning]}`])), explanation: `${descriptions[meaning]} The form before こと and the ending after it work together; noticing only a negative word is not enough.` }, { ...facts, meaning }),
				q("experience-interview", a, v, { prompt: `${summary}\n今日の予定：${planned ? "同じことをする予定です。" : "今日は別のことをするので、この行動はしません。"}\n質問：前にした経験はありますか。それから、今日もしますか。`, subprompt: "Answer from this person's point of view. Which reply preserves both their experience and today's separate plan?", band: "Track both parts of the reply.", options: interviewClaims.map(interviewText), answer: interviewText({ ever, planned }), choiceFacts: interviewClaims, explanation: `The person ${ever ? "has" : "has no"} past experience and ${planned ? "plans" : "does not plan"} to do it today. Experience alone would not establish today's plan; the separate statement supplies it.` }, facts),
				q("specific-event", a, v, { prompt: `${setup}\n昨日の予定を確認するための連絡です。\n${person}：「${actual ? "昨日の予定は、最後まで全部終わりました。" : "昨日の予定は中止になりました。結局、全くしませんでした。"}」\n聞き手は、昨日実際にしたかどうかを知りたいと言っています。`, subprompt: "Choose the direct report of yesterday's event. Do not replace it with a general habit or lifetime claim.", band: "Keep the requested time scope.", options: specificOptions, answer: specificOptions[0], choiceFacts: ["event", "habit", "never", "opposite-event"], explanation: "A specific-event report uses the ordinary past form here. Past-experience grammar is not categorically forbidden with time expressions, but it does not serve this request to report yesterday's event directly." }, { ...facts, actual, conclusion: "event" }),
				q("repair-claim", a, v, { prompt: `${summary}\n書き手は、次のように間違えてまとめました。\n「${sentences(a, ever ? "never" : "ever", person)[0]}」`, subprompt: `Correct only the experience claim. Keep ${person} and the action; use たことがあります or its negative.`, band: "Repair the meaning, not the vocabulary.", vocabulary: vocabulary(a), fields: [field(a, historyMeaning, person, "Corrected report")], explanation: "The draft reverses whether any experience exists. The intended correction changes the experience predicate, not the action to a recurring or occasional one." }, { ...facts, meaning: historyMeaning }),
				q("two-records", a, v, { prompt: `${setup}\n二人のインタビューを読み比べます。\n${person}：「${sentences(a, record.a ? "sometimes-not" : "never")[0]}${record.a ? `でも、ふだんは${a.masu}。` : "いつか初めてやってみたいです。"}」\n${other}：「${sentences(a, record.b ? "sometimes-not" : "never")[0]}${record.b ? `ふだんは${a.masu}が、毎回ではありません。` : "今度、初めての機会があるかもしれません。"}」`, subprompt: "Which summary preserves both people's accounts? A negative action inside こと and a negative experience predicate do not make the same claim.", band: "Track each person's account.", options: recordClaims.map(recordText), answer: recordText(record), choiceFacts: recordClaims, explanation: "Someone who usually does the action but sometimes omits it has experience. That is incompatible with the lifetime 'never' claim. Read where each negative applies; the two people may have the same or different accounts." }, { ...facts, ...record }),
				q("timeline-update", a, v, { prompt: `${setup}\n昨日まで：${person}にとって、まだ一度もしたことのない行動でした。\n今日：初めてする予定で準備しましたが、${actual ? "予定どおり最後まで終わりました。" : "始める前に中止になりました。結局、今回もしませんでした。"}\n今の経験について、プロフィールを書き直します。`, subprompt: `Write ${person}'s experience status now using たことがあります or its negative. Include their name; a plan alone does not count as an experience.`, band: "Update only after checking what happened.", vocabulary: vocabulary(a), fields: [field(a, actual ? "ever" : "never", person, "Experience as of now")], explanation: actual ? "The first completed event creates a past experience. The previous 'never' statement is no longer true." : "Preparing and planning do not establish the experience. Since it was cancelled before starting, 'never done it' remains true.", }, { ...facts, actual, meaning: actual ? "ever" : "never" }),
				q("evidence-limit", a, v, { prompt: `${setup}\n${person}の最近五回の休みだけを調べました。\nその間は${ever ? "二回しました。ほかの三回はしませんでした。" : "一回もしませんでした。"}\nそれ以前のことは、本人にもまだ聞いていません。`, subprompt: "What can this limited record establish about lifetime experience?", band: "Do not turn a short record into an entire history.", options: Object.values(evidenceLabels), answer: evidenceLabels[evidence], choiceFacts: Object.keys(evidenceLabels), explanation: ever ? "The two recorded occurrences prove at least one experience. They do not prove a daily habit." : "No occurrence in these five breaks does not prove 'never in their life'. Earlier history is unknown.", }, { ...facts, conclusion: evidence }),
				q("change-meaning", a, v, { prompt: sentences(a, changed === "never" ? "sometimes-not" : "never", person)[0], subprompt: `Keep ${person} and the action, but change the meaning to: ${descriptions[changed]} Use a こと construction.`, band: "Change where the negative applies.", vocabulary: vocabulary(a), fields: [field(a, changed, person, "New intended meaning")], explanation: "Vたことがありません means never having done the action. Vないことがあります means sometimes not doing it. Moving the negative changes the claim, not merely the style." }, { ...facts, meaning: changed })
			];
		}
		const buildBank = () => core.shuffle(actions, rng).flatMap((a) => [0, 1, 2, 3].flatMap((v) => buildQuestions(a, v)));
		return { buildBank, grade, normalize, lexicon: { actions, nouns: [...nouns.values()], verbs: [...verbs.values()] } };
	}
	const selectQueue = (bank, count = 25, options) => core.selectQueue(bank, count, options, version, tasks);
	return { version, create, selectQueue, tasks, readings, frames, meanings, sentences };
});
