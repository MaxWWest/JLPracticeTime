/* A bounded cross-unit pilot. Facts precede language, choices and feedback. */
(function (root, factory) {
	if (typeof module === "object" && module.exports) module.exports = factory(require("./grammar-practice-core.js"));
	else root.BossPractice = factory(root.GrammarPracticeCore);
})(typeof globalThis === "object" ? globalThis : this, function (core) {
	"use strict";
	const version = "boss-01-05-v1", roundSize = 10;
	const cases = [
		{ id: "study-booking", unit: "comparison", secondary: "time", format: "Choose a plan", pattern: "comparison chain + deadline" },
		{ id: "hotel-change", unit: "comparison", secondary: "ability", format: "Check the message", pattern: "current comparison + availability" },
		{ id: "reading-handover", unit: "time", secondary: "invitation", format: "Complete the conversation", pattern: "まで / までに + accepted offer" },
		{ id: "kitchen-call", unit: "time", secondary: "invitation", format: "Choose a reply", pattern: "action stage + invitation response" },
		{ id: "moving-help", unit: "invitation", secondary: "ability", format: "Restore the missing line", pattern: "offer / request / shared action / experience" },
		{ id: "outing-plan", unit: "invitation", secondary: "ability", format: "Report the agreement", pattern: "counterproposal + participants" },
		{ id: "equipment-loan", unit: "ability", secondary: "time", format: "Check both conditions", pattern: "skill + availability before a deadline" },
		{ id: "broadcast-access", unit: "ability", secondary: "time", format: "Choose the current update", pattern: "access + perception after a change" },
		{ id: "first-visit", unit: "experience", secondary: "invitation", format: "Complete the conversation", pattern: "experience + accepted or declined plan" },
		{ id: "weekend-meal", unit: "experience", secondary: "comparison", format: "Check the message", pattern: "never / sometimes not + action comparison" }
	];
	const extraNouns = [
		["自習室", "じしゅうしつ", "study room"], ["図書室", "としょしつ", "reading room"], ["研修室", "けんしゅうしつ", "training room"],
		["資料", "しりょう", "documents"], ["説明書", "せつめいしょ", "instructions"], ["記事", "きじ", "article"],
		["箱", "はこ", "box"], ["机", "つくえ", "desk"], ["いす", "いす", "chair"],
		["ケーキ", "けーき", "cake"], ["サンドイッチ", "さんどいっち", "sandwiches"], ["弁当", "べんとう", "packed lunch"],
		["カメラ", "かめら", "camera"], ["プリンター", "ぷりんたー", "printer"], ["パソコン", "ぱそこん", "computer"],
		["水族館", "すいぞくかん", "aquarium"], ["博物館", "はくぶつかん", "museum"], ["美術館", "びじゅつかん", "art museum"]
	];
	const readings = [
		...extraNouns.map(([word, kana]) => [word, kana]), ["受付", "うけつけ"], ["予約", "よやく"], ["完了", "かんりょう"], ["宿泊", "しゅくはく"], ["料金", "りょうきん"], ["満室", "まんしつ"], ["空室", "くうしつ"], ["相談", "そうだん"], ["交代", "こうたい"], ["担当", "たんとう"], ["続き", "つづき"], ["台所", "だいどころ"], ["材料", "ざいりょう"], ["準備", "じゅんび"], ["途中", "とちゅう"], ["運ぶ", "はこぶ"], ["運び", "はこび"], ["運ん", "はこん"], ["一緒", "いっしょ"], ["手伝", "てつだ"], ["去年", "きょねん"], ["今年", "ことし"], ["参加", "さんか"], ["先週", "せんしゅう"], ["今週", "こんしゅう"], ["修理", "しゅうり"], ["操作", "そうさ"], ["返却", "へんきゃく"], ["練習", "れんしゅう"], ["登録", "とうろく"], ["会員", "かいいん"], ["配信", "はいしん"], ["放送", "ほうそう"], ["映像", "えいぞう"], ["音声", "おんせい"], ["会議", "かいぎ"], ["廊下", "ろうか"], ["毎回", "まいかい"], ["週末", "しゅうまつ"], ["中止", "ちゅうし"], ["予定", "よてい"], ["閉館", "へいかん"], ["初めて", "はじめて"], ["一度", "いちど"], ["何度", "なんど"], ["経験", "けいけん"], ["値段", "ねだん"], ["完成", "かんせい"], ["静か", "しずか"], ["東館", "ひがしかん"], ["西館", "にしかん"], ["田中", "たなか"], ["山田", "やまだ"], ["佐藤", "さとう"], ["午前", "ごぜん"], ["午後", "ごご"], ["土曜日", "どようび"], ["日曜日", "にちようび"]
	];
	const edges = {
		study: { words: ["自習室", "図書室", "研修室", "会議室", "教室"], verb: "勉強する", particle: "で" },
		reading: { words: ["資料", "説明書", "記事"], verb: "読む", particle: "を" },
		meal: { words: ["カレー", "スープ", "ケーキ", "サンドイッチ", "弁当"], verb: "作る", particle: "を" },
		moving: { words: ["箱", "机", "いす"], verb: "運ぶ", particle: "を" },
		outing: { words: ["水族館", "博物館", "美術館"], verb: "行く", particle: "に" },
		equipment: { words: ["カメラ", "プリンター", "パソコン"], verb: "使う", particle: "を" }
	};
	const pairs = (a, b) => a.flatMap((x) => b.map((y) => [x, y]));
	const englishDays = { 土曜日: "Saturday", 日曜日: "Sunday" };
	const englishNames = { 田中さん: "Tanaka", 山田さん: "Yamada" };
	const bareEnglish = (value) => value.replace(/^(?:the|an?)\s+/i, "");
	function conclusion(id, f) {
		switch (id) {
			case "study-booking": return { room: f.quietOrder.at(-1), timing: "by" };
			case "hotel-change": return { cheaper: f.prices.east < f.prices.west ? "east" : "west", available: f.available };
			case "reading-handover": return { actor: f.assignee, limit: f.finished ? "deadline" : "duration" };
			case "kitchen-call": return { stage: f.start > f.now + 60 ? "tomorrow" : f.now < f.start ? "before" : f.now < f.end ? "during" : "after" };
			case "moving-help": return { intent: f.intent };
			case "outing-plan": return { day: f.acceptedDay, participants: f.participants };
			case "equipment-loan": return { skill: f.independent, usable: f.repairEnd < f.returnBy };
			case "broadcast-access": return { access: f.registered, audible: f.audibleNow };
			case "first-visit": return { ever: f.completed, tomorrow: f.accepted };
			case "weekend-meal": return { history: f.pastCount ? "sometimes-not" : "never", cheaper: f.homeCost < f.shopCost ? "home" : "shop" };
			default: throw new Error(`Unknown Boss case: ${id}`);
		}
	}
	function supported(id, facts, claims) {
		const expected = conclusion(id, facts);
		return Object.keys(expected).length === Object.keys(claims).length && Object.entries(expected).every(([key, value]) => claims[key] === value);
	}
	function create({ nounPools = {}, verbPool = [], aliases = [], seed = Date.now() } = {}) {
		const rng = core.random(seed), nouns = new Map(Object.values(nounPools).flat().map((n) => [n.ja, n]));
		extraNouns.forEach(([ja, kana, en]) => nouns.set(ja, { ja, kana, en }));
		const verbs = new Map(verbPool.map((v) => [v.ja, v]));
		verbs.set("運ぶ", { ja: "運ぶ", en: "carry", forms: { dictionary: "運ぶ", masuStem: "運び", te: "運んで", ta: "運んだ", nai: "運ばない" } });
		function action(edge) {
			const frame = edges[edge], word = core.pick(frame.words, rng), noun = nouns.get(word), verb = verbs.get(frame.verb);
			if (!noun || !verb) throw new Error(`Missing Boss lexical edge ${edge}: ${word}/${frame.verb}`);
			return { word, en: bareEnglish(noun.en), verb: verb.ja, dict: word + frame.particle + verb.forms.dictionary, stem: word + frame.particle + verb.forms.masuStem, ta: word + frame.particle + verb.forms.ta, te: word + frame.particle + verb.forms.te, nai: word + frame.particle + verb.forms.nai, edge };
		}
		const normalize = core.normalizer([...aliases, ...readings, ["読む", "よむ"], ["読み", "よみ"], ["読ん", "よん"], ["終え", "おえ"], ["終わ", "おわ"], ["続け", "つづけ"], ["十六", "16"], ["十七", "17"], ["じゅうろく", "16"], ["じゅうしち", "17"], ["じゅうなな", "17"], ["時", "じ"]]), grade = core.grader(normalize);
		function make(id, variant, facts, content, choices, conflicts, words = []) {
			const spec = cases.find((c) => c.id === id), truths = choices.filter((c) => supported(id, facts, c.claims));
			if (truths.length !== 1 || new Set(choices.map((c) => c.ja)).size !== 4) throw new Error(`Ambiguous Boss case ${id}:${variant}`);
			const expected = conclusion(id, facts), answer = truths[0];
			let writing;
			if (id === "reading-handover") {
				const limit = `${facts.hour}時${facts.finished ? "までに" : "まで"}`, object = `${words[0]}を`;
				const predicates = ["読みます", "読む", ...(facts.finished ? ["読み終えます", "読み終える", "読み終わります", "読み終わる"] : ["読み続けます", "読み続ける", "読んでいます", "読んでいる"])];
				const accepted = ["が", "は"].flatMap((particle) => predicates.flatMap((verb) => [
					`${facts.assignee}${particle}${limit}${object}${verb}。`, `${limit}${facts.assignee}${particle}${object}${verb}。`, `${facts.assignee}${particle}${object}${limit}${verb}。`
				]));
				writing = { subprompt: `Write one note naming the agreed reader, the ${facts.hour}:00 time limit, and the reading action.`, accepted, vocabulary: `${words[0]} (${bareEnglish(nouns.get(words[0]).en)}) / 読む (read)` };
			}
			if (id === "moving-help") {
				const object = `${words[0]}を`, intent = facts.intent;
				const accepted = {
					self: ["私が", "私が一人で"].flatMap((who) => [`${who}${object}運びましょうか。`, `${object}${who}運びましょうか。`]),
					joint: ["一緒に", "二人で"].flatMap((who) => ["ませんか", "ましょうか"].flatMap((end) => [`${who}${object}運び${end}。`, `${object}${who}運び${end}。`])),
					listener: [`${object}運んでくれませんか。`, `あなたが${object}運んでくれませんか。`, `${object}運んでもらえませんか。`, `あなたに${object}運んでもらえませんか。`],
					history: ["", "あなたは"].flatMap((who) => ["が", "は"].map((particle) => `${who}${object}運んだこと${particle}ありますか。`))
				}[intent];
				writing = { subprompt: "Write Tanaka's missing line. Name the item; make the intended participants clear when proposing an action.", accepted, vocabulary: `${words[0]} (${bareEnglish(nouns.get(words[0]).en)}) / 運ぶ・運び・運んで・運んだ (carry)` };
			}
			if (writing) writing.fields = [core.field("Your sentence", [answer.ja, ...writing.accepted], choices.filter((c) => c !== answer).map((c) => ({ accepted: [c.ja], message: conflicts[Object.keys(expected).find((key) => c.claims[key] !== expected[key])] })))];
			return {
				kind: spec.format, mode: "choice", ...content, band: "Choose the best answer.", options: choices.map((c) => c.ja), answer: answer.ja,
				writing, choiceFacts: choices.map((c) => c.claims), choiceMeanings: Object.fromEntries(choices.map((c) => [c.ja, c.en])),
				choiceFeedback: Object.fromEntries(choices.filter((c) => c !== answer).map((c) => [c.ja, `Your choice says: ${c.en} ${Object.keys(expected).filter((key) => c.claims[key] !== expected[key]).map((key) => conflicts[key]).join(" ")}`])),
				meta: { engine: version, sessionId: "boss-01-05", sourceSessionId: spec.unit, units: [spec.unit, id === "moving-help" && facts.intent === "history" ? "experience" : spec.secondary], familyId: spec.unit, familyLabel: spec.unit, task: id, topic: spec.unit, pattern: spec.pattern, format: spec.format, difficulty: "boss", domain: id, familyKey: id, sceneKey: `${id}:${variant}`, id: `${id}:${variant}`, facts, vocabulary: words }
			};
		}
		function buildCase(id, v) {
			switch (id) {
				case "study-booking": {
					const rooms = core.shuffle(edges.study.words, rng).slice(0, 3), [a, b, middle] = rooms, quietOrder = v % 2 ? [a, middle, b] : [b, middle, a], hour = 14 + v % 3;
					const [loud, mid, quiet] = quietOrder;
					return make(id, v, { quietOrder, deadline: hour }, {
						prompt: `明日の勉強場所を探しています。${mid}は${loud}より静かですが、${quiet}ほど静かではありません。\n${a}と${b}には空きがあります。${mid}は満室です。受付から「今日の${hour}時には予約が全部終わっているようにしてください」と言われました。\n今は${hour - 1}時です。友だちは、空いている二つの部屋のうち、静かなほうを希望しています。`,
						subprompt: "Which plan respects both your friend's preference and the reception desk's instruction?",
						promptEnglish: `The ${bareEnglish(nouns.get(mid).en)} is quieter than the ${bareEnglish(nouns.get(loud).en)}, but not as quiet as the ${bareEnglish(nouns.get(quiet).en)}. Only the ${bareEnglish(nouns.get(a).en)} and the ${bareEnglish(nouns.get(b).en)} have space. Reception requires booking to be complete by ${hour}:00 today; it is now ${hour - 1}:00. Your friend prefers the quieter available room.`,
						explanation: `Following both comparisons gives ${loud} < ${mid} < ${quiet} in quietness. Choose ${quiet}. The booking must be completed by ${hour}:00, not started at that time.`
					}, pairs([a, b], ["by", "from"]).map(([room, timing]) => ({ claims: { room, timing }, ja: `${room === a ? b : a}より${room}のほうが静かなので、${room}にしましょう。予約は${hour}時${timing === "by" ? "までに済ませましょう" : "から始めましょう"}。`, en: `Choose the ${bareEnglish(nouns.get(room).en)} as the quieter room, and ${timing === "by" ? "complete" : "start"} the booking ${timing === "by" ? "by" : "at"} ${hour}:00.` })), { room: `The two comparisons establish that ${quiet}, not ${loud}, is the quieter available room.`, timing: `Reception needs the booking finished by ${hour}:00; starting then misses that requirement.` }, rooms);
				}
				case "hotel-change": {
					const prices = { east: v % 2 ? 8000 : 6000, west: v % 2 ? 6000 : 8000 }, available = v < 2 ? "east" : "west", name = { east: "東館", west: "西館" };
					return make(id, v, { prices, available }, {
						prompt: `ホテルの案内には、先週は東館のほうが西館より安かったと書いてあります。\n電話で今日の宿泊料金を聞くと、東館は${prices.east}円、西館は${prices.west}円でした。\n受付：「今日、空室があるのは${name[available]}だけです。もう一方は満室なので、予約できません。」\n古い案内を持っている友だちに、今の状況を伝えます。`,
						subprompt: "Which message accurately updates both the price comparison and tonight's availability?",
						promptEnglish: `An old notice says the east building was cheaper last week. Today's prices are east ¥${prices.east}, west ¥${prices.west}. Only the ${available} building has vacancies tonight. Update your friend, who has the old notice.`,
						explanation: `Today's figures, not last week's notice, establish the price comparison. A cheaper building is not necessarily available: only ${name[available]} can be booked tonight.`
					}, pairs(["east", "west"], ["east", "west"]).map(([cheaper, room]) => ({ claims: { cheaper, available: room }, ja: `今日は${name[cheaper === "east" ? "west" : "east"]}は${name[cheaper]}ほど安くありません。今夜泊まれるのは${name[room]}だけです。`, en: `The ${cheaper} building is cheaper today; only the ${room} building is available tonight.` })), { cheaper: "That comparison reverses today's prices. Last week's price order cannot replace today's figures.", available: `The receptionist says that only ${name[available]} has a vacancy. Price and availability are separate facts.` }, ["東館", "西館", "ホテル"]);
				}
				case "reading-handover": {
					const a = action("reading"), finished = v % 2 === 0, assignee = v < 2 ? "田中さん" : "山田さん", hour = 16 + v % 2;
					const offer = assignee === "田中さん" ? "田中：私が読みましょうか。\n山田：お願いします。私はほかの準備をします。" : "田中：私が読みましょうか。\n山田：ありがとう。でも、今回は私が読みます。田中さんはほかの準備をお願いします。";
					return make(id, v, { finished, assignee, hour }, {
						prompt: `会議の前に、${a.word}を読む担当を決めています。\n${offer}\n担当者には次のように伝えました。\n「${finished ? `${hour}時には最後のページまで終わっている必要があります。${hour - 1}時50分に読み終えて、すぐ別の仕事に移ってください。` : `${hour - 1}時から${hour}時までの一時間、読み続けてください。その時間で全部は終わらないので、続きは明日読みます。`}」`,
						subprompt: "Which note preserves the agreed reader and the reading commitment?",
						promptEnglish: `Tanaka offers to read the ${a.en}. ${assignee === "田中さん" ? "Yamada accepts and handles other preparations." : "Yamada thanks Tanaka but says Yamada will read instead."} The reader must ${finished ? `finish the entire text by ${hour}:00; the instruction is to finish at ${hour - 1}:50 and immediately switch to other work` : `read continuously from ${hour - 1}:00 until ${hour}:00, leaving the rest for tomorrow`}.`,
						explanation: `${assignee} is assigned after the response to the offer. ${finished ? "The requirement is completion by the stated time: までに." : "The required activity continues to the endpoint, with material still unread: まで."}`
					}, pairs(["田中さん", "山田さん"], ["deadline", "duration"]).map(([actor, limit]) => ({ claims: { actor, limit }, ja: `${actor}が、${hour}時${limit === "deadline" ? "までに" : "まで"}${a.stem}ます。`, en: `${englishNames[actor]} will ${limit === "deadline" ? "finish reading" : "continue reading"} the ${a.en} ${limit === "deadline" ? "by" : "until"} ${hour}:00.` })), { actor: `The reply assigns the reading to ${assignee}; an offer alone is not an accepted assignment.`, limit: finished ? "The instruction requires finishing the whole text by the time, not continuing for a fixed duration." : "The instruction requires continuing to the endpoint and explicitly leaves some text for tomorrow; it is not a promise to finish by then." }, [a.word, a.verb]);
				}
				case "kitchen-call": {
					const a = action("meal"), states = ["before", "during", "after", "tomorrow"], stage = states[v], now = 720;
					const times = { before: [721, 750], during: [700, 740], after: [690, 720], tomorrow: [2160, 2200] };
					const evidence = { before: "材料と道具の準備が終わりました。まだ作り始めていませんが、電話を切ったらすぐ始めます。", during: "作り始めて二十分です。まだ半分しか終わっていません。", after: "たった今、全部できあがって、お皿にのせました。", tomorrow: "今日作る予定は中止にしました。まだ何も作っていません。明日の昼に作ります。" };
					const text = { before: `今から${a.dict}ところです。まだできていないので、少し待ってください。`, during: `${a.te}いるところです。まだできていないので、少し待ってください。`, after: `${a.ta}ところです。もうできたので、一緒に食べましょう。`, tomorrow: `今日は${a.stem}ません。明日作るので、明日一緒に食べませんか。` };
					const en = { before: `I am just about to make the ${a.en}; please wait.`, during: `I am in the middle of making the ${a.en}; please wait.`, after: `I have just made the ${a.en}; let's eat together now.`, tomorrow: `I am not making the ${a.en} today; would you like to eat together tomorrow?` };
					return make(id, v, { now, start: times[stage][0], end: times[stage][1] }, {
						prompt: `今日は友だちと${a.word}を食べる予定で、あなたが作ることになっています。\n${evidence[stage]}\n友だちから電話です。「もう食べられますか。今、一緒に食べませんか。」\nあなた：「＿＿＿＿」`,
						subprompt: "Choose the reply that matches the kitchen situation and answers your friend's invitation.",
						promptEnglish: `You are responsible for making ${a.en} to share with a friend. ${["Preparation is complete, but you have not begun; you will start immediately after the call.", "You started twenty minutes ago and are only halfway through.", "You have just finished and put the food on plates.", "Today's cooking was cancelled before it began; you will cook tomorrow at noon."][v]} Your friend calls: 'Is it ready? Shall we eat together now?'`,
						explanation: `${en[stage]} The invitation cannot establish that the food is ready. The preparation record determines both the stage and whether eating now is possible.`
					}, states.map((s) => ({ claims: { stage: s }, ja: text[s], en: en[s] })), { stage: `${en[stage]} The selected reply instead places the cooking at a different stage or on a different day.` }, [a.word, a.verb]);
				}
				case "moving-help": {
					const a = action("moving"), intents = ["self", "joint", "listener", "history"], intent = intents[v];
					const scenarios = {
						self: [`山田さんは別の作業で手が離せません。田中さんは手が空いていて、一人でも${a.word}を運べます。`, "山田：ありがとうございます。では、田中さん一人にお願いします。"],
						joint: [`田中さんと山田さんはどちらも手が空いています。${a.word}は重すぎて、一人では運べません。`, "山田：いいですね。二人で運びましょう。"],
						listener: [`田中さんは手をけがしていて、${a.word}を持てません。山田さんなら一人で運べます。`, "山田：はい。田中さんは休んでいてください。私一人で運びます。"],
						history: ["先生は、仕事を頼む前に去年の作業の経験を確認するよう、田中さんに言いました。今はまだ作業を頼みません。", `山田：はい。去年、同じ${a.word}を運びました。`]
					};
					const text = { self: `私が${a.stem}ましょうか。`, joint: `一緒に${a.stem}ませんか。`, listener: `${a.te}くれませんか。`, history: `${a.ta}ことがありますか。` };
					const en = { self: `Shall I carry the ${a.en}?`, joint: `Would you like to carry the ${a.en} together?`, listener: `Could you carry the ${a.en} for me?`, history: `Have you ever carried the ${a.en}?` };
					return make(id, v, { intent }, {
						prompt: `教室から${a.word}を移す前に、二人が話しています。\n${scenarios[intent][0]}\n田中：「＿＿＿＿」\n${scenarios[intent][1]}`,
						subprompt: "Which missing line fits the situation and Yamada's response?",
						promptEnglish: `${["Yamada is occupied with other work; Tanaka is free and can carry the item alone. Yamada replies, 'Thank you. I'll leave it to you, Tanaka, on your own.'", "Neither person can carry the heavy item alone. Yamada replies, 'Good idea. Let's carry it together.'", "Tanaka's hand is injured. Yamada can carry the item alone and replies, 'Yes. You rest; I'll carry it alone.'", "The teacher asks Tanaka to check last year's experience before assigning work. Yamada replies, 'Yes, I carried the same item last year.'"][v]} The item is a ${a.en}.`,
						explanation: `${en[intent]} Read who would act and what the next reply accepts. ましょうか can offer the speaker's help; a joint invitation and a request for the listener's help assign different participants. The history question checks an earlier event, not a current agreement.`
					}, intents.map((i) => ({ claims: { intent: i }, ja: text[i], en: en[i] })), { intent: `The next reply fits this missing line: ${en[intent]} Your choice asks about a different actor, shared participation, or past event.` }, [a.word, a.verb]);
				}
				case "outing-plan": {
					const a = action("outing"), acceptedDay = v % 2 ? "土曜日" : "日曜日", initial = acceptedDay === "土曜日" ? "日曜日" : "土曜日", participants = v < 2 ? "together" : "tanaka";
					return make(id, v, { acceptedDay, participants }, {
						prompt: `田中：${initial}、一緒に${a.stem}ませんか。\n山田：その日は行けません。${acceptedDay}なら大丈夫です。\n田中：私は${acceptedDay}も行けます。${participants === "together" ? `では、${acceptedDay}に一緒に行きましょう。\n山田：そうしましょう。` : `ただ、今回は一人でゆっくり見たいので、${acceptedDay}に私だけで行きます。\n山田：分かりました。私は今回は行きません。`}\n佐藤さんは最初の誘いだけ聞いていました。二人の最後の予定を伝えます。`,
						subprompt: "Which message reports the final agreement, rather than the first suggestion?",
						promptEnglish: `Tanaka first invites Yamada to the ${a.en} on ${englishDays[initial]}. Yamada is unavailable then but available on ${englishDays[acceptedDay]}. Tanaka can also go on ${englishDays[acceptedDay]}. ${participants === "together" ? "They agree to go together that day." : "Tanaka says they now prefer to go alone that day; Yamada confirms they will not join."} Sato heard only the first invitation.`,
						explanation: `The final plan is ${acceptedDay}, ${participants === "together" ? "with both people" : "with Tanaka alone"}. Being available does not establish participation: the final proposal and response do.`
					}, pairs(["土曜日", "日曜日"], ["together", "tanaka"]).map(([day, people]) => ({ claims: { day, participants: people }, ja: `${day}、${people === "together" ? "田中さんと山田さんが一緒に" : "山田さんは行かず、田中さんだけが"}${a.stem}ます。`, en: `On ${englishDays[day]}, ${people === "together" ? "Tanaka and Yamada will go together" : "Tanaka will go alone and Yamada will not go"} to the ${a.en}.` })), { day: `The first proposed date was replaced with ${acceptedDay}.`, participants: `The final response confirms ${participants === "together" ? "both people's participation" : "that only Tanaka will go"}; availability alone is not acceptance.` }, [a.word, a.verb]);
				}
				case "equipment-loan": {
					const a = action("equipment"), independent = v % 2 === 0, repairEnd = v < 2 ? 10 : 12, returnBy = 11;
					return make(id, v, { independent, repairEnd, returnBy }, {
						prompt: `午前中、学校で${a.word}を借りて作業する予定です。\n操作の練習では、${independent ? "もう説明を見なくても、一人で全部できました" : "先生が全部手伝いました。まだ一人では操作できません"}。\nところが、今日使う${a.word}は修理中です。${repairEnd}時に修理が終わり、すぐ使える状態になります。あなたが借りられる時間は${returnBy}時までです。作業には10分かかります。\nほかの${a.word}は借りられません。`,
						subprompt: "Which summary distinguishes your own skill from whether this loan leaves enough time to work?",
						promptEnglish: `You plan to borrow a ${a.en} at school this morning. During training you ${independent ? "operated it independently without instructions" : "needed the teacher's help throughout and still cannot operate it alone"}. Repairs finish at ${repairEnd}:00; your permitted borrowing period ends at ${returnBy}:00. The task takes ten minutes, and there is no other machine.`,
						explanation: `Independent ability is ${independent ? "established" : "not yet present"}. Repair ends ${repairEnd < returnBy ? "before" : "after"} the return deadline, so there ${repairEnd < returnBy ? "is" : "is not"} enough available time for the ten-minute task. Ability and the available time window are separate.`
					}, pairs([true, false], [true, false]).map(([skill, usable]) => ({ claims: { skill, usable }, ja: `一人で${a.word}を使うことは${skill ? "できます" : "できません"}。今日の貸し出し時間には、作業する時間が${usable ? "あります" : "ありません"}。`, en: `I ${skill ? "can" : "cannot"} use the ${a.en} independently; today's loan ${usable ? "does" : "does not"} leave time to do the task.` })), { skill: `The training record says you ${independent ? "can already operate it alone" : "still need help to operate it"}.`, usable: `Repairs finish at ${repairEnd}:00, while return is required by ${returnBy}:00; the task needs ten minutes.` }, [a.word, a.verb]);
				}
				case "broadcast-access": {
					const registered = v % 2 === 0, audibleNow = v < 2;
					return make(id, v, { registered, audibleNow }, {
						prompt: `会員向けの講演が、今始まったところです。自分のアカウントで映像を見るには登録が必要です。\nあなたの登録は${registered ? "完了しています" : "まだ済んでいません"}。受付では、別のアカウントで同じ講演を再生しています。\nさっきは${audibleNow ? "廊下にいて、話している声は全く耳に入りませんでした。今、受付に戻ると、先生の話す言葉がはっきり分かります" : "受付で先生の話す言葉がはっきり分かりました。今は廊下に出てドアを閉めたので、先生の声は全く耳に入りません"}。`,
						subprompt: "Which update describes your own account and what reaches your ears now?",
						promptEnglish: `A members-only talk has just started. Registration is required to view it through your account; your registration ${registered ? "is complete" : "is not complete"}. Reception plays the same talk through a different account. ${audibleNow ? "You could not hear it from the corridor, but now at reception the speaker's words are clear." : "You heard it clearly at reception, but now in the corridor with the door shut no sound reaches you."}`,
						explanation: `Registration ${registered ? "permits" : "does not yet permit"} viewing through your account. At your current location you ${audibleNow ? "hear" : "do not hear"} the speaker. The earlier location and reception's separate account do not change these facts.`
					}, pairs([true, false], [true, false]).map(([access, audible]) => ({ claims: { access, audible }, ja: `自分のアカウントで映像を見ることが${access ? "できます" : "できません"}。今、先生の声が${audible ? "聞こえます" : "聞こえません"}。`, en: `I ${access ? "can" : "cannot"} view through my account; I ${audible ? "can hear" : "cannot hear"} the speaker now.` })), { access: `Your own account ${registered ? "has" : "does not have"} the required registration.`, audible: `Use the current location, not the earlier one: the speaker's voice ${audibleNow ? "is now audible" : "no longer reaches you"}.` }, ["講演", "映像", "先生の声"]);
				}
				case "first-visit": {
					const a = action("outing"), completed = v % 2 === 0, accepted = v < 2;
					return make(id, v, { completed, accepted }, {
						prompt: `田中さんは昨日まで、その${a.word}に一度も行っていませんでした。今日、初めて行く予定で出かけましたが、${completed ? "予定どおり中に入り、全部見てから帰ってきました" : "途中で電車が止まりました。家に戻ったので、そこへは行っていません"}。\n帰宅後、山田さんから「明日、一緒に行きませんか」と連絡がありました。田中さんは${accepted ? "「いいですね。明日は一緒に行きましょう」と答えました" : "「明日は用事があるので、行けません」と答えました"}。`,
						subprompt: "Which message correctly updates your friend after today's events and the final reply?",
						promptEnglish: `Until yesterday Tanaka had never visited this ${a.en}. Today Tanaka ${completed ? "entered, saw the whole place, and returned home" : "set out, but a train disruption forced a return home without reaching the place"}. Yamada then invited Tanaka for tomorrow. Tanaka ${accepted ? "accepted the invitation" : "said they had other commitments and could not go"}.`,
						explanation: `A plan alone does not establish a past visit. Today's event ${completed ? "does create that experience" : "still leaves Tanaka without that experience"}. Tomorrow's invitation was ${accepted ? "accepted" : "declined"}, independently of the past experience.`
					}, pairs([true, false], [true, false]).map(([ever, tomorrow]) => ({ claims: { ever, tomorrow }, ja: `田中さんは、その${a.word}に行ったことが${ever ? "あります" : "ありません"}。明日は山田さんと一緒に${tomorrow ? "行く予定です" : "行く予定はありません"}。`, en: `Tanaka ${ever ? "has" : "has never"} visited the ${a.en}; tomorrow Tanaka ${tomorrow ? "plans" : "does not plan"} to go with Yamada.` })), { ever: `Today Tanaka ${completed ? "actually completed the first visit" : "turned back without reaching the place"}; yesterday's record must be updated only if the visit occurred.`, tomorrow: `Tanaka ${accepted ? "accepted" : "declined"} the invitation for tomorrow.` }, [a.word, a.verb]);
				}
				case "weekend-meal": {
					const a = action("meal"), pastCount = v % 2 ? 0 : 8, homeCost = v < 2 ? 300 : 600, shopCost = v < 2 ? 500 : 400;
					const history = pastCount ? "sometimes-not" : "never";
					return make(id, v, { pastCount, homeCost, shopCost }, {
						prompt: `同じ一人分の${a.word}について、店で買うと${shopCost}円、家で作ると全部で${homeCost}円です。\n田中さんは「${pastCount ? `家で何度も作りました。ふだんの週末も作りますが、忙しい週末は作らず、店で買います` : "今まで一度も自分で作っていません。いつも店で買っていますが、来月初めて作ってみたいです"}」と話しました。\n友だちに、田中さんの話と値段の違いをまとめます。`,
						subprompt: "Which message preserves both Tanaka's account and the cost comparison?",
						promptEnglish: `Buying the ${a.en} costs ¥${shopCost}; making the same amount at home costs ¥${homeCost} in total. Tanaka ${pastCount ? "has made it many times and usually cooks on weekends, but sometimes buys it instead on busy weekends" : "has never made it, always buys it, and hopes to try making it for the first time next month"}. Summarize the account and the prices.`,
						explanation: `${pastCount ? "The account describes occasional omissions within a usual habit, not no lifetime experience." : "The account says there has been no past experience; a future intention does not change that."} Compare the same serving: ${homeCost < shopCost ? "making" : "buying"} it is cheaper. With action comparisons, the dictionary verb connects directly to ほうが.`
					}, pairs(["sometimes-not", "never"], ["home", "shop"]).map(([h, cheaper]) => ({ claims: { history: h, cheaper }, ja: `田中さんは家で${h === "never" ? a.ta + "ことがありません" : a.nai + "こともありますが、ふだんは作ります"}。${a.word}は、${cheaper === "home" ? "買うより作るほうが" : "作るより買うほうが"}安いです。`, en: `Tanaka ${h === "never" ? "has never made it at home" : "usually makes it at home but sometimes does not"}; ${cheaper === "home" ? "making" : "buying"} it is cheaper.` })), { history: `Tanaka's account ${history === "never" ? "rules out all past experience" : "explicitly includes past experience and a usual habit with exceptions"}.`, cheaper: `Making costs ¥${homeCost}; buying the same serving costs ¥${shopCost}. That price order is reversed in your choice.` }, [a.word, a.verb]);
				}
				default: throw new Error(`Missing Boss builder ${id}`);
			}
		}
		const buildBank = () => cases.flatMap((spec) => [0, 1, 2, 3].map((v) => buildCase(spec.id, v)));
		return { buildBank, grade, normalize };
	}
	function selectQueue(bank, count = roundSize, { seed = Date.now(), recent = [] } = {}) {
		const rng = core.random(seed), history = new Set(recent), candidates = bank.filter((q) => q.meta?.engine === version);
		// Prefer an unseen fact variant of each case, without repeating a case within a round.
		const chosen = core.unique(candidates.map((q) => q.meta.familyKey)).map((key) => {
			const family = candidates.filter((q) => q.meta.familyKey === key), fresh = family.filter((q) => !history.has(q.meta.sceneKey));
			return core.pick(fresh.length ? fresh : family, rng);
		});
		let ordered = core.selectQueue(chosen, Math.min(count, roundSize), { seed }, version, cases.map((c) => ({ id: c.id, count: 2.5 })));
		if (ordered.length === roundSize) {
			const quick = core.selectQueue(ordered.filter((q) => !q.writing), 8, { seed }, version, cases.map((c) => ({ id: c.id, count: 2.5 }))), finale = ordered.filter((q) => q.writing);
			if (finale[0].meta.topic === quick.at(-1).meta.topic) finale.reverse();
			ordered = [...quick, ...finale.map((q) => ({ ...q, ...q.writing, mode: "text", options: undefined, choiceFacts: undefined, kind: "Final challenge", band: "Write one Japanese sentence.", meta: { ...q.meta, answerMode: "production" } }))];
			// Rebalance the remaining eight choices after removing the two writing tasks.
			const positions = core.shuffle([0, 1, 2, 3, 0, 1, 2, 3], rng);
			quick.forEach((q, i) => {
				const claims = new Map(q.options.map((option, j) => [option, q.choiceFacts[j]]));
				q.options = core.shuffle(q.options.filter((o) => o !== q.answer), rng); q.options.splice(positions[i], 0, q.answer);
				q.choiceFacts = q.options.map((o) => claims.get(o));
			});
		}
		return ordered;
	}
	return { version, roundSize, create, selectQueue, cases, edges, readings, conclusion, supported };
});
