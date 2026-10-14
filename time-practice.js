/* Lexical frames -> temporal facts -> Japanese realization -> assessment. No UI state. */
(function (root, factory) {
	const api = factory();
	if (typeof module === "object" && module.exports) module.exports = api;
	else root.TimePractice = api;
})(typeof globalThis === "object" ? globalThis : this, function () {
	"use strict";
	const version = "time-v1";
	const extraNouns = [
		["音楽", "おんがく", "music"], ["ラジオ", "らじお", "the radio"], ["ニュース", "にゅーす", "the news"], ["ポッドキャスト", "ぽっどきゃすと", "a podcast"],
		["メール", "めーる", "the email"], ["手紙", "てがみ", "the letter"], ["日記", "にっき", "my diary entry"], ["レポート", "れぽーと", "the report"],
		["小説", "しょうせつ", "the novel"], ["説明書", "せつめいしょ", "the instructions"], ["資料", "しりょう", "the documents"],
		["新聞", "しんぶん", "the newspaper"], ["案内", "あんない", "the guide"], ["記事", "きじ", "the article"], ["メモ", "めも", "the note"], ["招待状", "しょうたいじょう", "the invitation"],
		["映画", "えいが", "the film"], ["動画", "どうが", "the video"], ["朝ご飯", "あさごはん", "breakfast"], ["夕ご飯", "ゆうごはん", "dinner"], ["サンドイッチ", "さんどいっち", "the sandwiches"]
	];
	const readings = [
		...extraNouns.map(([ja, kana]) => [ja, kana]),
		["作文", "さくぶん"], ["教科書", "きょうかしょ"], ["雑誌", "ざっし"], ["お茶", "おちゃ"], ["牛乳", "ぎゅうにゅう"], ["昼ご飯", "ひるごはん"],
		["図書館", "としょかん"], ["教室", "きょうしつ"], ["喫茶店", "きっさてん"], ["事務所", "じむしょ"], ["公園", "こうえん"], ["学校", "がっこう"], ["会議室", "かいぎしつ"],
		["友だち", "ともだち"], ["田中", "たなか"], ["山田", "やまだ"], ["佐藤", "さとう"], ["母", "はは"],
		["授業", "じゅぎょう"], ["会議", "かいぎ"], ["始まる", "はじまる"], ["来る", "くる"], ["帰る", "かえる"],
		["読", "よ"], ["書", "か"], ["聞", "き"], ["見", "み"], ["作", "つく"], ["食", "た"], ["飲", "の"], ["待", "ま"], ["勉強", "べんきょう"],
		["私", "わたし"], ["今", "いま"], ["今日", "きょう"], ["昨日", "きのう"], ["全部", "ぜんぶ"], ["終", "お"],
		["準備", "じゅんび"], ["予定", "よてい"], ["途中", "とちゅう"], ["休憩", "きゅうけい"], ["連絡", "れんらく"], ["直後", "ちょくご"],
		["開始", "かいし"], ["終了", "しゅうりょう"], ["時点", "じてん"], ["記録", "きろく"], ["主", "おも"],
		["音", "おと"], ["声", "こえ"], ["質問", "しつもん"], ["返事", "へんじ"], ["同時", "どうじ"], ["別々", "べつべつ"],
		["作業", "さぎょう"], ["活動", "かつどう"], ["半分", "はんぶん"], ["様子", "ようす"], ["時刻", "じこく"], ["移動", "いどう"], ["最初", "さいしょ"], ["再現", "さいげん"], ["一分", "いっぷん"], ["二人", "ふたり"]
	];
	const tasks = [
		{ id: "overlap-report", label: "Read the activity record", topic: "nagara", count: 2 },
		{ id: "combine-actions", label: "Combine two actions", topic: "nagara", count: 2 },
		{ id: "same-actor", label: "Who did what, when?", topic: "nagara", count: 2 },
		{ id: "main-action", label: "Choose the main focus", topic: "nagara", count: 2 },
		{ id: "stage-choice", label: "Choose the current stage", topic: "tokoro", count: 2 },
		{ id: "stage-reply", label: "Send a progress update", topic: "tokoro", count: 2 },
		{ id: "two-updates", label: "Two moments, two updates", topic: "tokoro", count: 2 },
		{ id: "stage-repair", label: "Correct the action stage", topic: "tokoro", count: 2 },
		{ id: "two-limits", label: "Two different time limits", topic: "limits", count: 3 },
		{ id: "feasible-plan", label: "Check both commitments", topic: "limits", count: 2 },
		{ id: "change-limit", label: "Change the commitment", topic: "limits", count: 2 },
		{ id: "limit-meaning", label: "What does the promise mean?", topic: "limits", count: 2 }
	];
	const frames = [
		{ id: "reading", verb: "読む", objects: ["教科書", "雑誌", "小説", "説明書", "資料", "新聞", "案内", "記事"], en: "read", past: "read", ing: "reading", bounded: true },
		{ id: "writing", verb: "書く", objects: ["作文", "メール", "手紙", "日記", "レポート", "メモ", "招待状"], en: "write", past: "wrote", ing: "writing", bounded: true },
		{ id: "cooking", verb: "作る", objects: ["カレー", "スープ", "昼ご飯", "朝ご飯", "夕ご飯", "サンドイッチ"], en: "make", past: "made", ing: "making", bounded: true },
		{ id: "watching", verb: "見る", objects: ["映画", "動画"], en: "watch", past: "watched", ing: "watching", bounded: true },
		{ id: "eating", verb: "食べる", objects: ["カレー", "昼ご飯", "朝ご飯", "夕ご飯", "サンドイッチ"], en: "eat", past: "ate", ing: "eating", bounded: true },
		{ id: "listening", verb: "聞く", objects: ["音楽", "ラジオ", "ニュース", "ポッドキャスト"], en: "listen to", past: "listened to", ing: "listening to" },
		{ id: "drinking", verb: "飲む", objects: ["お茶", "コーヒー", "ジュース", "牛乳"], en: "drink", past: "drank", ing: "drinking" }
	];
	// Narrow edges express compatible attention/resources, not unrestricted tag combinations.
	const overlapEdges = [["listening", "writing"], ["listening", "reading"], ["listening", "cooking"], ["drinking", "reading"], ["drinking", "watching"]];
	const places = ["図書館", "教室", "喫茶店", "事務所", "公園", "学校", "会議室"];
	const people = ["田中さん", "山田さん", "佐藤さん"];
	const names = { "田中さん": "Tanaka", "山田さん": "Yamada", "佐藤さん": "Sato" };
	const events = [["授業が始まる", "class starts"], ["会議が始まる", "the meeting starts"], ["友だちが来る", "my friend arrives"], ["母が帰る", "my mother comes home"]];
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
	const unique = (values) => [...new Set(values)];
	const clock = (minutes) => `${Math.floor(minutes / 60)}時${minutes % 60 ? `${minutes % 60}分` : ""}`;
	const englishClock = (minutes) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`;
	function relationship(a, b) {
		if (a.actor !== b.actor) return "different-actors";
		if (a.end <= b.start) return "a-first";
		if (b.end <= a.start) return "b-first";
		return "overlap";
	}
	function stageAt(now, start, end) { return now < start ? "before" : now < end ? "during" : "after"; }
	function meetsPlan(plan, deadline, until) { return plan.finish <= deadline && plan.waitStart === plan.finish && plan.waitEnd >= Math.max(until, plan.waitStart); }
	function startTimes(action) {
		if (action.word === "朝ご飯") return action.frame === "cooking" ? [420, 450] : [450, 480];
		if (action.word === "昼ご飯") return action.frame === "cooking" ? [660, 690] : [720, 750];
		if (action.word === "夕ご飯") return action.frame === "cooking" ? [1020, 1050] : [1080, 1140];
		return [540, 600, 660, 780, 840, 900, 1080];
	}
	function field(label, accepted, multiline = true) { return { label, accepted: unique(accepted), answer: accepted[0], multiline }; }
	function stageSentence(action, stage) { return `${stage === "before" ? action.dict : stage === "during" ? action.te + "いる" : action.ta}ところです。`; }
	function stageAnswers(action, stage) {
		const text = stageSentence(action, stage);
		const prefixes = stage === "before" ? ["", "今、", "今から、", "これから、"] : stage === "after" ? ["", "今、", "たった今、", "ちょうど、"] : ["", "今、", "ちょうど今、"];
		const endings = [text, text.replace("です。", "だ。"), text.replace("です。", "なんです。")];
		return prefixes.flatMap((prefix) => endings.flatMap((ending) => [prefix + ending, `私は${prefix}${ending}`, `${prefix}私は${ending}`]));
	}
	function simultaneous(a, b, past = false) { return `${a.stem}ながら、${past ? b.ta + "。" : b.masu + "。"}`; }
	function combinedAnswers(a, b, actor) { return ["", "私は", actor + "は", "今日は", "今日、私は", "私は今日、"].flatMap((prefix) => [prefix + simultaneous(a, b), prefix + simultaneous(a, b).replace(b.masu, b.dict)]); }
	function create({ nounPools = {}, verbPool = [], aliases = [], seed = Date.now() } = {}) {
		const rng = random(seed);
		const nouns = new Map(Object.values(nounPools).flat().map((n) => [n.ja, n]));
		extraNouns.forEach(([ja, kana, en]) => nouns.set(ja, { ja, kana, en }));
		const verbs = new Map(verbPool.map((v) => [v.ja, v]));
		const aliasesMap = new Map([...aliases, ...readings]);
		const pattern = new RegExp([...aliasesMap.keys()].sort((a, b) => b.length - a.length).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
		function normalize(value) {
			let text = String(value || "").normalize("NFKC");
			// Normalize clock spelling, but retain the actual time and grammatical particles.
			text = text.replace(/([一二三四五六七八九十]+)(時|分)/g, (_, n, unit) => {
				const digits = "〇一二三四五六七八九", parts = n.split("十");
				const number = parts.length === 2 ? (parts[0] ? digits.indexOf(parts[0]) : 1) * 10 + (parts[1] ? digits.indexOf(parts[1]) : 0) : digits.indexOf(n);
				return number >= 0 ? number + unit : n + unit;
			});
			const hours = ["", "いち", "に", "さん", "よ", "ご", "ろく", "しち", "はち", "く", "じゅう", "じゅういち", "じゅうに", "じゅうさん", "じゅうよ", "じゅうご", "じゅうろく", "じゅうしち", "じゅうはち", "じゅうく", "にじゅう"];
			text = text.replace(/(\d+)時/g, (_, n) => (hours[Number(n)] || n) + "じ");
			const mins = { 1: "いっぷん", 5: "ごふん", 10: "じゅっぷん", 15: "じゅうごふん", 20: "にじゅっぷん", 25: "にじゅうごふん", 30: "さんじゅっぷん", 35: "さんじゅうごふん", 40: "よんじゅっぷん", 45: "よんじゅうごふん", 50: "ごじゅっぷん", 55: "ごじゅうごふん" };
			text = text.replace(/(\d+)分/g, (_, n) => mins[Number(n)] || n + "ふん");
			return text.replace(pattern, (word) => aliasesMap.get(word)).replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/じっぷん/g, "じゅっぷん").replace(/[\s。、，,.!！？「」『』"'()（）]/g, "").toLowerCase();
		}
		const actions = frames.flatMap((frame) => frame.objects.map((word) => {
			const noun = nouns.get(word), verb = verbs.get(frame.verb);
			if (!noun || !verb) throw new Error(`Time vocabulary missing: ${word} / ${frame.verb}`);
			const boundedObjects = { "教科書": ["教科書のこのページ", "this page of the textbook"], "雑誌": ["雑誌のこの記事", "this article in the magazine"], "小説": ["小説のこのページ", "this page of the novel"], "新聞": ["新聞のこの記事", "this article in the newspaper"] };
			const [object, objectEn] = frame.id === "reading" && boundedObjects[word] ? boundedObjects[word] : [word, noun.en];
			const prefix = `${object}を`, f = verb.forms;
			return { id: `${frame.id}:${word}`, frame: frame.id, word, object, verb: frame.verb, bounded: !!frame.bounded, dict: prefix + f.dictionary, stem: prefix + f.masuStem, masu: prefix + f.masu, te: prefix + f.te, ta: prefix + f.ta, en: `${frame.en} ${objectEn}`, ing: `${frame.ing} ${objectEn}`, past: `${frame.past} ${objectEn}` };
		}));
		const bounded = actions.filter((a) => a.bounded);
		const wordBank = (...items) => unique(items.flatMap((a) => [a.dict, a.stem, a.te + "いる", a.ta, a.masu])).join(" / ");
		function question(taskId, scene, content) {
			const task = tasks.find((t) => t.id === taskId);
			const q = { kind: task.label, ...content, meta: { engine: version, task: task.id, topic: task.topic, pattern: task.topic === "nagara" ? "ながら" : task.topic === "tokoro" ? "ところです" : "まで / までに", sourceSessionId: "time", difficulty: "hard", ...scene } };
			q.meta.id = `${task.id}:${scene.sceneKey}`;
			q.mode = q.fields ? "text" : "choice";
			if (q.fields) q.answer = q.fields.map((f) => f.answer).join(" / ");
			else if (!q.options.includes(q.answer) || new Set(q.options).size !== q.options.length) throw new Error(`Invalid choices: ${q.meta.id}`);
			return q;
		}
		function nagaraQuestions(a, b) {
			const [person, other] = shuffle(people, rng), start = pick(startTimes(b), rng);
			const scenario = pick(["overlap", "a-first", "b-first", "different-actors"], rng);
			const facts = { a: { actor: person, start, end: start + 20 }, b: { actor: person, start: start + 5, end: start + 25 } };
			if (scenario === "a-first") facts.b = { actor: person, start: start + 20, end: start + 40 };
			if (scenario === "b-first") { facts.b.start = start - 20; facts.b.end = start; }
			if (scenario === "different-actors") facts.b.actor = other;
			const scene = { familyKey: `overlap:${a.id}:${b.id}`, sceneKey: `overlap:${a.id}:${b.id}:${scenario}:${start}`, structure: pick(["activity-log", "conversation"], rng), domain: `${a.frame}-${b.frame}`, vocabulary: [a.word, b.word], facts };
			const record = (action, fact) => `${fact.actor}：${clock(fact.start)}〜${clock(fact.end)}　${action.dict}`;
			const reports = [`${person}は${simultaneous(a, b, true)}`, `${person}は${a.te}から、${b.ta}。`, `${person}は${b.te}から、${a.ta}。`, `${person}が${a.te}いる間、${other}は${b.te}いました。`];
			const evidence = `${record(a, facts.a)}\n${record(b, facts.b)}`;
			const correct = ["overlap", "a-first", "b-first", "different-actors"].indexOf(relationship(facts.a, facts.b));
			const sameA = { actor: person, start, end: start + 20 }, sameB = { actor: person, start: start + 5, end: start + 25 };
			const stories = [{ a: sameA, b: sameB }, { a: sameA, b: { ...sameB, actor: other } }, { a: sameA, b: { ...sameB, start: start + 20, end: start + 40 } }, { a: sameA, b: { ...sameB, start: start - 20, end: start } }];
			const main = `${person}は「${b.dict}」ことを主にして、その間に「${a.dict}」こともします。`;
			return [
				question("overlap-report", scene, { prompt: `${scene.structure === "activity-log" ? "昨日の活動を記録しました。" : "昨日何をしていたか聞いて、時間をメモしました。"}\n${evidence}\n同じ人の二つの時間が重なる場合、その間は両方を一緒にしていました。`, subprompt: "Which report matches both the people and the times?", band: "Choose the accurate report.", options: reports, answer: reports[correct], choiceFacts: ["overlap", "a-first", "b-first", "different-actors"], explanation: scenario === "overlap" ? "The same person performs both actions during overlapping periods, so ながら fits. It does not mean one action finished before the other began." : scenario === "different-actors" ? "The times overlap, but the actors differ. This simultaneous-action use of ながら joins two actions by the same actor; 間 can describe two people's actions." : "The periods do not overlap. てから preserves which action happened first; ながら would change that relationship.", english: `${names[person]}'s activity record concerns ${a.ing} and ${b.ing}.` }),
				question("combine-actions", scene, { prompt: `今日の予定を一文で伝えたいです。\n${main}\n二つの活動は同時にします。`, subprompt: `Combine the actions with ながら; keep ${b.ing} as the main action. Write as ${names[person]}, using the supplied phrases.`, band: "Write one sentence, preserving the main focus.", vocabulary: wordBank(a, b), fields: [field("Combined sentence", combinedAnswers(a, b, person))], explanation: `${a.stem}ながら is the accompanying action. ${b.masu} comes in the main clause. Reversing the clauses can be grammatical, but changes the focus explicitly requested here.`, english: `I will ${b.en} while ${a.ing}.` }),
				question("same-actor", scene, { prompt: `「${person}は${simultaneous(a, b, true)}」\nこの文と合う記録を探しています。同じ人の二つの時間が重なる場合、その間は両方を一緒にしていました。`, subprompt: "Which record can this sentence describe?", band: "Check the actor and the overlap.", options: stories.map((f) => `${record(a, f.a)}\n${record(b, f.b)}`), answer: `${record(a, stories[0].a)}\n${record(b, stories[0].b)}`, choiceFacts: stories, explanation: "Both actions must belong to the named person and overlap in time. Merely happening on the same day, or at the same time for different people, is not enough.", english: `${names[person]} ${b.past} while ${a.ing}.` }),
				question("main-action", scene, { prompt: `二つのことを同時にする予定です。\n${main}\nその予定を、何を主にするかが分かるように伝えてください。`, subprompt: "Both clause orders can be grammatical. Which one puts the stated main activity in the main clause?", band: "Choose the requested focus and timing.", options: [simultaneous(a, b), simultaneous(b, a), `${a.te}から、${b.masu}。`, `${b.te}から、${a.masu}。`], answer: simultaneous(a, b), explanation: "The main action follows ながら. The reversed ながら sentence is not bad Japanese; it gives the other activity the main focus. The てから choices instead make the activities sequential.", english: `The main activity is ${b.ing}; ${a.ing} accompanies it.` })
			];
		}
		function stageQuestions(action, variant) {
			const start = pick(startTimes(action), rng);
			const duration = action.word === "映画" ? pick([90, 100, 120], rng) : action.dict.includes("ページ") || action.word === "メモ" ? pick([5, 10], rng) : pick([20, 30, 40], rng);
			const end = start + duration, middle = start + Math.floor(duration / 2);
			const stage = ["before", "during", "after"][variant % 3];
			const now = stage === "before" ? start - 1 : stage === "during" ? middle : end + 1;
			const scene = { familyKey: `stage:${action.id}`, sceneKey: `stage:${action.id}:${stage}:${start}`, structure: ["interruption", "progress-message", "handover"][variant % 3], domain: action.frame, vocabulary: [action.word], facts: { stage, now, start, end, action: action.id } };
			const details = pick({
				before: ["まだ始めていませんが、準備はできました。すぐに始めます。", "必要な物をそろえました。まだ何もしていません。これからすぐに始めます。", "電話が終わったら、すぐに始めます。準備はもうできていますが、作業はまだです。"],
				during: ["少し前に始めました。まだ半分で、続けています。", "もう始めていますが、最後まで終わっていません。今も続けています。", "途中でやめずに続けています。終わるまで、もう少し時間が必要です。"],
				after: ["全部終わりました。終わってから、まだ一分しかたっていません。", "最後まで終えたのは、ほんの少し前です。今はもう続けていません。", "一分前に最後まで終えました。次に何をするか、これから考えます。"]
			}[stage], rng);
			const intro = pick(["友だちから電話がかかってきました。今の様子を伝えます。", "家族に短いメッセージを送ります。今の様子を聞かれました。", "次の予定を決めたいので、友だちが今の様子を聞いています。"], rng);
			const context = `${intro}\n作業：${action.dict}\n${details}`;
			const options = ["before", "during", "after"].map((s) => stageSentence(action, s));
			const otherStage = pick(["before", "during", "after"].filter((s) => s !== stage), rng);
			const moments = shuffle([stage, otherStage], rng);
			const momentTime = (s) => s === "before" ? start - 1 : s === "during" ? middle : end + 1;
			const explanation = `The context describes ${stage === "before" ? "preparation complete, but the action not yet started" : stage === "during" ? "the action already started and still in progress" : "the whole action completed just a minute ago"}. Use ${stage === "before" ? "dictionary form" : stage === "during" ? "ている" : "た-form"} + ところです. The action itself stays the same.`;
			return [
				question("stage-choice", scene, { prompt: context, subprompt: "Which reply accurately describes the current stage?", band: "Choose the progress report.", options, answer: stageSentence(action, stage), choiceFacts: ["before", "during", "after"], explanation, english: `The task is to ${action.en}. It is ${stage === "before" ? "about to begin" : stage === "during" ? "under way, about halfway through" : "entirely finished, just one minute ago"}.` }),
				question("stage-reply", scene, { prompt: context, subprompt: "Reply with a full sentence using ところです. Keep the supplied action; choose its stage from the situation.", band: "Write the current progress update.", vocabulary: wordBank(action), fields: [field("Reply", stageAnswers(action, stage))], explanation, english: `I ${stage === "before" ? "am about to " + action.en : stage === "during" ? "am in the middle of " + action.ing : "have just finished " + action.ing}.` }),
				question("two-updates", { ...scene, facts: { ...scene.facts, moments } }, { prompt: `今日の記録を見て、二つの時点の返事を再現します。\n作業：${action.dict}\n${clock(start - 1)}：準備ができました。この後すぐに始めました。\n${clock(start)}：開始。その後、休まずに続けました。\n${clock(end)}：全部終了。`, subprompt: "Write what you would say at each labelled time, using ところです. The fields are not necessarily in chronological order.", band: "Give both progress updates.", vocabulary: wordBank(action), fields: moments.map((s) => field(`At ${englishClock(momentTime(s))}`, stageAnswers(action, s))), explanation: `${clock(start - 1)} is just before starting; a time between ${clock(start)} and ${clock(end)} is during the action; ${clock(end + 1)} is just after completion. Do not reuse the same verb form for both moments.`, english: `Task: ${action.en}. Ready at ${englishClock(start - 1)}, started at ${englishClock(start)}, finished at ${englishClock(end)}. Give updates at ${moments.map((s) => englishClock(momentTime(s))).join(" and ")}.` }),
				question("stage-repair", scene, { prompt: `${context}\n送ろうとした返事：「${stageSentence(action, otherStage)}」`, subprompt: "The draft is grammatical, but describes the wrong stage. Correct it using ところです without changing the action.", band: "Correct the meaning, not the vocabulary.", vocabulary: wordBank(action), fields: [field("Corrected reply", stageAnswers(action, stage))], explanation, english: `Correct the draft to describe ${action.ing} ${stage === "before" ? "about to begin" : stage === "during" ? "in progress" : "just completed"}.` })
			];
		}
		function limitQuestions(action, place, variant) {
			const deadline = pick([600, 660, 840, 900, 1020], rng), until = deadline + 30;
			const event = pick(events, rng), useEvent = variant % 2 === 1;
			const boundary = useEvent ? event[0] : clock(deadline), boundaryEn = useEvent ? event[1] : englishClock(deadline);
			const scene = { familyKey: `limit:${action.id}`, sceneKey: `limit:${action.id}:${place}:${boundary}`, structure: useEvent ? "event-boundary" : "clock-boundary", domain: action.frame, vocabulary: [action.word, place], facts: { deadline, until, action: action.id, place, boundary } };
			const other = pick(bounded.filter((a) => ["reading", "writing"].includes(a.frame) && a.word !== action.word), rng);
			const markers = pick([["まで", "までに"], ["までに", "まで"], ["まで", "まで"], ["までに", "までに"]], rng);
			const lines = [action, other].map((a, i) => {
				const time = i ? clock(until) : boundary, marker = markers[i];
				return { text: `${time}［　］${a.masu}。`, answer: marker,
					detail: marker === "までに" ? `「${a.dict}」作業は、その時には全部終わっている必要があります。早く終わってもかまいません。` : `「${a.dict}」作業は、その時刻まで続けます。全部終わらなくても、その時にやめます。` };
			});
			const finish = deadline - pick([0, 5, 10], rng);
			const plans = [{ finish, waitStart: finish, waitEnd: until }, { finish: deadline + 5, waitStart: deadline + 5, waitEnd: until }, { finish, waitStart: finish, waitEnd: until - 10 }, { finish: deadline + 5, waitStart: deadline + 5, waitEnd: until - 10 }];
			const planText = (p) => `${clock(p.finish)}に作業を全部終える。その後すぐに${place}へ行き、${clock(p.waitEnd)}まで待つ。`;
			const targetDeadline = variant % 2 === 0;
			const marker = targetDeadline ? "までに" : "まで", oldMarker = targetDeadline ? "まで" : "までに";
			const target = `${boundary}${marker}${action.masu}。`, promise = `${clock(deadline)}${marker}${action.masu}。`;
			const meanings = targetDeadline ? [
				`${clock(deadline)}には全部終わっている必要がある。始める時刻は決めていない。`,
				`${clock(deadline)}には作業を始める。その時に全部終わっていなくてもいい。`,
				`${clock(deadline)}まで作業を続ける。全部終わっていなくても、その時にやめていい。`
			] : [
				`${clock(deadline)}まで続ける予定だ。全部終わるかどうかは、この文だけでは分からない。`,
				`${clock(deadline)}には全部終える予定だ。早く終われば、それより前にやめてもいい。`,
				`${clock(deadline)}に始める予定だ。それより前には何もせず、その後に作業を続ける。`
			];
			return [
				question("two-limits", { ...scene, vocabulary: [action.word, other.word], facts: { ...scene.facts, markers } }, { prompt: `今日の二つの約束です。\n${useEvent ? `${clock(deadline)}に${event[0]}予定です。\n` : ""}${lines.map((l, i) => `${i + 1}. ${l.detail}\n${l.text.replace("［　］", `［${i + 1}］`)}`).join("\n")}`, subprompt: "Fill each gap with まで or までに. Either marker may be used more than once.", band: "Choose each time marker independently.", fields: lines.map((l, i) => field(`Gap ${i + 1}`, [l.answer], false)), explanation: "Continuing an activity up to a boundary takes まで. Having the whole task completed by that boundary takes までに; early completion is allowed. Both reading and writing can express either meaning, and the two gaps need not differ.", english: [action, other].map((a, i) => `${markers[i] === "までに" ? "Finish" : "Continue"} the task (${a.en}) ${markers[i] === "までに" ? "by" : "until"} ${i ? englishClock(until) : boundaryEn}.`).join(" ") }),
				question("feasible-plan", scene, { prompt: `今日の約束を確認しています。\n「${clock(deadline)}までに${action.masu}。その後、${clock(until)}まで${place}で友だちを待ちます。」\n作業する場所から待つ場所への移動時間は、考えなくてかまいません。`, subprompt: "Which plan keeps both commitments?", band: "Check completion and the end of waiting.", options: plans.map(planText), answer: planText(plans[0]), choiceFacts: plans, explanation: `The task must finish no later than ${clock(deadline)}, and the waiting must continue through ${clock(until)}. Finishing exactly at the deadline is allowed, as is finishing earlier. Meeting only one condition is not enough.`, english: `Finish the task (${action.en}) by ${englishClock(deadline)}, then wait at the specified place until ${englishClock(until)}. Ignore travel time.` }),
				question("change-limit", scene, { prompt: `最初の予定：「${boundary}${oldMarker}${action.masu}」\n予定が変わりました。${targetDeadline ? "今度は、その時には全部終わっている必要があります。早く終わったら、やめてかまいません。" : "今度は、全部終わるかどうかではなく、その時まで作業を続けることを伝えます。"}`, subprompt: "Rewrite the promise to express the new commitment. Keep the action and the time boundary; use まで or までに.", band: "Write the revised promise.", vocabulary: `${boundary} / ${action.masu}`, fields: [field("New promise", [target, `私は${target}`, `${action.object}は${boundary}${marker}${verbs.get(action.verb).forms.masu}。`, `${action.object}を${boundary}${marker}${verbs.get(action.verb).forms.masu}。`, target.replace(action.masu, action.dict)])], explanation: targetDeadline ? "The new promise is completion by a deadline, so まで changes to までに. This is not a test of whether the verb describes a quick action." : "The new promise concerns continuing an activity until a boundary, not guaranteeing its completion. Use まで, without に.", english: targetDeadline ? `Finish the task (${action.en}) by ${boundaryEn}.` : `Continue the task (${action.en}) until ${boundaryEn}, without promising to complete all of it.` }),
				question("limit-meaning", scene, { prompt: `今日は「${action.dict}」作業に時間がかかりそうです。予定について、次のように言いました。\n「${promise}」`, subprompt: "What does this promise actually require?", band: "Choose the interpretation supported by the sentence.", options: meanings, answer: meanings[0], explanation: targetDeadline ? "までに sets a latest completion time. It does not specify the starting time, require continuous work throughout the period, or allow completion after the deadline." : "まで marks how long the activity is to continue. This sentence does not itself guarantee the whole task will be completed then.", english: `I will ${action.en} ${targetDeadline ? "by" : "until"} ${englishClock(deadline)}.` })
			];
		}
		function buildBank() {
			const bank = [];
			for (const [left, right] of overlapEdges) for (const a of actions.filter((a) => a.frame === left)) for (const b of actions.filter((a) => a.frame === right)) bank.push(...nagaraQuestions(a, b));
			for (const action of bounded) {
				for (let variant = 0; variant < 3; variant++) bank.push(...stageQuestions(action, variant));
				if (["reading", "writing"].includes(action.frame)) for (const [variant, place] of places.entries()) bank.push(...limitQuestions(action, place, variant));
			}
			return bank;
		}
		function grade(q, value) {
			if (q.mode === "choice") return { correct: value === q.answer, parts: [] };
			const input = Array.isArray(value) ? value : [value];
			const parts = q.fields.map((f, i) => f.accepted.some((answer) => normalize(answer) === normalize(input[i])));
			return { correct: input.length === q.fields.length && parts.every(Boolean), parts };
		}
		return { buildBank, grade, normalize, lexicon: { actions, nouns: [...nouns.values()] } };
	}
	function selectQueue(bank, count = 25, { seed = Date.now(), recent = [] } = {}) {
		const rng = random(seed), candidates = shuffle(bank.filter((q) => q.meta?.engine === version), rng);
		const used = new Set(), history = new Set(recent), queue = [];
		const usage = { task: new Map(), topic: new Map(), structure: new Map(), domain: new Map(), vocabulary: new Map(), answer: new Map() };
		const quotas = new Map(tasks.map((t) => [t.id, Math.max(1, Math.ceil(t.count * count / 25))]));
		const bump = (map, key) => map.set(key, (map.get(key) || 0) + 1);
		while (queue.length < count) {
			let best, bestScore = Infinity;
			for (const q of candidates) {
				const m = q.meta, last = queue.at(-1)?.meta;
				if (used.has(m.familyKey)) continue;
				const taskUse = usage.task.get(m.task) || 0;
				let score = taskUse >= quotas.get(m.task) ? 10000 : 0;
				score += taskUse / quotas.get(m.task) * 100 + (usage.topic.get(m.topic) || 0) * 25;
				if (last?.task === m.task) score += 600;
				if (last?.topic === m.topic) score += 150;
				if (last?.domain === m.domain) score += 100;
				if (history.has(m.familyKey)) score += 250;
				score += (usage.domain.get(m.domain) || 0) * 15 + (usage.structure.get(m.structure) || 0) * 12;
				score += m.vocabulary.reduce((sum, word) => sum + (usage.vocabulary.get(word) || 0) * 18, 0);
				if (q.fields?.every((f) => !f.multiline)) score += (usage.answer.get(q.answer) || 0) * 60;
				if (score < bestScore) { best = q; bestScore = score; }
			}
			if (!best) break;
			queue.push({ ...best, options: best.options ? [...best.options] : undefined });
			used.add(best.meta.familyKey);
			for (const key of ["task", "topic", "structure", "domain"]) bump(usage[key], best.meta[key]);
			for (const word of best.meta.vocabulary) bump(usage.vocabulary, word);
			bump(usage.answer, best.answer);
		}
		const positions = new Map();
		let lastPosition = -1, run = 0;
		for (const q of queue.filter((q) => q.options)) {
			const factsByOption = q.choiceFacts ? new Map(q.options.map((option, i) => [option, q.choiceFacts[i]])) : null;
			const counts = positions.get(q.options.length) || Array(q.options.length).fill(0);
			const allowed = shuffle(counts.map((_, i) => i), rng).filter((i) => run < 2 || i !== lastPosition);
			const position = allowed.sort((a, b) => counts[a] - counts[b])[0];
			q.options = shuffle(q.options.filter((o) => o !== q.answer), rng);
			q.options.splice(position, 0, q.answer);
			if (factsByOption) q.choiceFacts = q.options.map((option) => factsByOption.get(option));
			counts[position]++; positions.set(counts.length, counts);
			run = lastPosition === position ? run + 1 : 1; lastPosition = position;
		}
		return queue;
	}
	return { version, create, selectQueue, tasks, readings, frames, overlapEdges, relationship, stageAt, meetsPlan, stageSentence, stageAnswers };
});
