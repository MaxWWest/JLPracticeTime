/* Compatible actions -> conversational intentions -> Japanese turns -> assessment. */
(function (root, factory) {
	if (typeof module === "object" && module.exports) module.exports = factory(require("./grammar-practice-core.js"));
	else root.InvitationPractice = factory(root.GrammarPracticeCore);
})(typeof globalThis === "object" ? globalThis : this, function (core) {
	"use strict";
	const version = "invitation-v1";
	const extraNouns = [
		["美術館", "びじゅつかん", "the art museum"], ["博物館", "はくぶつかん", "the museum"], ["水族館", "すいぞくかん", "the aquarium"], ["動物園", "どうぶつえん", "the zoo"],
		["サンドイッチ", "さんどいっち", "sandwiches"], ["そば", "そば", "soba noodles"], ["ラーメン", "らーめん", "ramen"], ["ココア", "ここあ", "cocoa"], ["紅茶", "こうちゃ", "black tea"], ["夕ご飯", "ゆうごはん", "dinner"],
		["映画", "えいが", "a film"], ["動画", "どうが", "a video"], ["試合", "しあい", "a match"], ["ドラマ", "どらま", "a drama"], ["日本語", "にほんご", "Japanese"], ["英語", "えいご", "English"],
		["発音", "はつおん", "pronunciation"], ["会話", "かいわ", "conversation"], ["ピアノ", "ぴあの", "piano"], ["ギター", "ぎたー", "guitar"],
		["招待状", "しょうたいじょう", "the invitation"], ["申込書", "もうしこみしょ", "the application form"], ["案内状", "あんないじょう", "the notice"], ["メモ", "めも", "the note"], ["手紙", "てがみ", "the letter"],
		["説明書", "せつめいしょ", "the instructions"], ["案内", "あんない", "the guide"], ["新聞", "しんぶん", "the newspaper"], ["荷物", "にもつ", "the luggage"], ["箱", "はこ", "the box"], ["椅子", "いす", "the chair"],
		["袋", "ふくろ", "the bag"], ["机", "つくえ", "the desk"], ["窓", "まど", "the window"], ["ドア", "どあ", "the door"], ["カーテン", "かーてん", "the curtains"], ["傘", "かさ", "an umbrella"],
		["鉛筆", "えんぴつ", "a pencil"], ["消しゴム", "けしごむ", "an eraser"], ["資料", "しりょう", "the documents"], ["写真", "しゃしん", "the photos"], ["メール", "めーる", "the email"], ["地図", "ちず", "the map"]
	];
	// Local extensions have the same conjugation/tag contract as the shared verb pool.
	const extraVerbs = [
		{ ja: "運ぶ", en: "carry", group: "godan", tags: ["portable", "help"], forms: { dictionary: "運ぶ", masuStem: "運び", masu: "運びます", te: "運んで", ta: "運んだ", nai: "運ばない", potential: "運べる", volitional: "運ぼう" } },
		{ ja: "開ける", en: "open", group: "ichidan", tags: ["openable", "help"], forms: { dictionary: "開ける", masuStem: "開け", masu: "開けます", te: "開けて", ta: "開けた", nai: "開けない", potential: "開けられる", volitional: "開けよう" } }
	];
	const readings = [
		...extraNouns.map(([ja, kana]) => [ja, kana]),
		["公園", "こうえん"], ["図書館", "としょかん"], ["喫茶店", "きっさてん"], ["映画館", "えいがかん"], ["文法", "ぶんぽう"], ["漢字", "かんじ"], ["昼ご飯", "ひるごはん"], ["お茶", "おちゃ"], ["牛乳", "ぎゅうにゅう"], ["辞書", "じしょ"],
		["土曜日", "どようび"], ["日曜日", "にちようび"], ["金曜日", "きんようび"], ["明日", "あした"], ["一緒に", "いっしょに"], ["一人で", "ひとりで"], ["二人で", "ふたりで"], ["私たち", "わたしたち"], ["私", "わたし"],
		["行き", "いき"], ["食べ", "たべ"], ["飲み", "のみ"], ["見", "み"], ["勉強し", "べんきょうし"], ["練習し", "れんしゅうし"], ["作り", "つくり"], ["書き", "かき"], ["読み", "よみ"], ["運び", "はこび"], ["開け", "あけ"], ["貸し", "かし"], ["送り", "おくり"],
		["誘い", "さそい"], ["返事", "へんじ"], ["提案", "ていあん"], ["相談", "そうだん"], ["予定", "よてい"], ["自分で", "じぶんで"], ["代わりに", "かわりに"], ["お願い", "おねがい"],
		["大丈夫", "だいじょうぶ"], ["都合", "つごう"], ["準備", "じゅんび"], ["授業", "じゅぎょう"], ["仕事", "しごと"], ["受付", "うけつけ"], ["連絡", "れんらく"], ["資料", "しりょう"], ["必要", "ひつよう"],
		["音読", "おんどく"], ["声", "こえ"], ["出して", "だして"], ["内容", "ないよう"], ["最後", "さいご"], ["確認", "かくにん"], ["手", "て"], ["空いて", "あいて"], ["時間", "じかん"],
		["動作", "どうさ"], ["行動", "こうどう"], ["眼鏡", "めがね"], ["申し出", "もうしで"], ["賛成", "さんせい"], ["参加", "さんか"], ["相手", "あいて"], ["役に立ち", "やくにたち"]
	];
	const tasks = [
		{ id: "invite-message", label: "Invite someone", topic: "invitation", count: 3 },
		{ id: "accept-plan", label: "Accept a counterproposal", topic: "proposal", count: 3 },
		{ id: "offer-message", label: "Offer to take over", topic: "offer", count: 3 },
		{ id: "change-actor", label: "Change who will act", topic: "roles", count: 4 },
		{ id: "two-intents", label: "Two messages, different intentions", topic: "roles", count: 4 },
		{ id: "context-pair", label: "One ending, two contexts", topic: "roles", count: 2 },
		{ id: "choose-reply", label: "Keep the shared plan", topic: "proposal", count: 1 },
		{ id: "reply-meaning", label: "Read the response in context", topic: "offer", count: 1 },
		{ id: "final-plan", label: "Track the final agreement", topic: "proposal", count: 1 },
		{ id: "counterproposal", label: "Decline and suggest another day", topic: "invitation", count: 1 },
		{ id: "missing-turn", label: "Restore the missing turn", topic: "offer", count: 1 },
		{ id: "scope-reading", label: "What has actually been agreed?", topic: "invitation", count: 1 }
	];
	// Edges constrain noun + verb + social use. Reasons never decide the answer by themselves.
	const frames = [
		{ id: "outing", verb: "行く", particle: "へ", objects: ["公園", "図書館", "喫茶店", "映画館", "美術館", "博物館", "水族館", "動物園"], use: "shared", en: "go to", setting: "今度の休みに、友だちと出かけたいと思っています。" },
		{ id: "meal", verb: "食べる", particle: "を", objects: ["カレー", "スープ", "サンドイッチ", "そば", "ラーメン"], use: "shared", en: "eat", setting: "次に一緒に食事をするときのために、友だちと店のメニューを見ています。" },
		{ id: "drink", verb: "飲む", particle: "を", objects: ["お茶", "コーヒー", "ジュース", "紅茶", "ココア"], use: "shared", en: "drink", setting: "今度、友だちと喫茶店で会う予定です。まだ日にちは決めていません。" },
		{ id: "watch", verb: "見る", particle: "を", objects: ["映画", "動画", "試合", "ドラマ"], use: "shared", en: "watch", setting: "二人の好きなものについて話しています。まだ一緒に見る約束はしていません。" },
		{ id: "study", verb: "勉強する", particle: "を", objects: ["日本語", "英語", "文法", "漢字"], use: "shared", en: "study", setting: "もうすぐテストがあります。友だちも同じテストを受けます。" },
		{ id: "practice", verb: "練習する", particle: "を", objects: ["発音", "会話", "ピアノ", "ギター"], use: "shared", en: "practice", setting: "友だちと同じ教室に通っています。二人とも、授業のほかにも練習したいと思っています。" },
		{ id: "cook", verb: "作る", particle: "を", objects: ["カレー", "スープ", "サンドイッチ", "昼ご飯", "夕ご飯"], use: "both", en: "make", setting: "友だちと次の食事の相談をしています。材料はそろっています。", problem: "Aは次の食事の準備をしたいのですが、ほかの仕事で手が空きません。Bは料理ができます。" },
		{ id: "write", verb: "書く", particle: "を", objects: ["招待状", "申込書", "案内状", "メモ", "手紙"], use: "both", en: "write", setting: "友だちと書く内容を考えています。二人で相談しながら書くことができます。", problem: "Aは書く必要がありますが、手をけがしています。内容はAが伝えられます。Bは今、手が空いています。" },
		{ id: "read-aloud", verb: "読む", particle: "を", before: "声に出して", objects: ["説明書", "案内", "新聞", "メモ", "手紙"], use: "both", en: "read aloud", setting: "二人で音読の練習をします。一人ずつ読むか、一緒に読むかを相談しています。", problem: "Aは眼鏡がなくて、字が読めません。Bには字がよく見えます。Aは内容を聞いて知りたいと思っています。" },
		{ id: "carry", verb: "運ぶ", particle: "を", objects: ["荷物", "箱", "椅子", "袋", "机"], use: "both", en: "carry", setting: "部屋を片付けています。軽い物なので一人でも運べますが、二人で運ぶこともできます。", problem: "Aは物を移したいのですが、手がふさがっています。Bは手が空いています。物は軽くて、一人でも運べます。" },
		{ id: "open", verb: "開ける", particle: "を", objects: ["窓", "ドア", "カーテン", "箱", "袋"], use: "help", en: "open", problem: "Aは開けたいのですが、両手で物を持っています。Bはすぐそばにいて、手が空いています。" },
		{ id: "lend", verb: "貸す", particle: "を", objects: ["辞書", "傘", "鉛筆", "消しゴム"], use: "help", en: "lend", problem: "Aは必要な物を忘れて、困っています。Bは同じ物を二つ持っていて、一つ貸すことができます。" },
		{ id: "send", verb: "送る", particle: "を", objects: ["資料", "写真", "メール", "地図", "案内状"], use: "both", en: "send", setting: "二人で送る内容を確認しています。二人とも送り方を知っています。", problem: "Aは送る必要があるのですが、インターネットが使えません。Bも同じデータを持っていて、送る相手を知っています。" }
	];
	const dayPairs = [["土曜日", "日曜日"], ["明日", "あさって"], ["金曜日", "土曜日"]];
	const dayEnglish = { "土曜日": "on Saturday", "日曜日": "on Sunday", "金曜日": "on Friday", "明日": "tomorrow", "あさって": "the day after tomorrow" };
	const atDay = (day) => day.endsWith("曜日") ? day + "に" : day;
	const preparationEdges = { outing: ["地図", "メール"], study: ["資料", "メール"], practice: ["資料", "メール"], write: ["資料", "メール"], "read-aloud": ["資料", "メール"], send: ["資料", "メール"] };
	const helpSituations = {
		cook: "A is busy setting the table. You can prepare the food.",
		write: "A has injured their hand. You can write what they dictate.",
		"read-aloud": "A has forgotten their glasses and cannot read the text. You can read it aloud.",
		carry: "A needs something moved, but their hands are full. You are free to help.",
		open: "A wants something opened, but is carrying things in both hands. Your hands are free.",
		lend: "A has forgotten something they need. You have a spare.",
		send: "A cannot get online. You have the same file and the recipient's address."
	};
	function random(seed) { let n = seed >>> 0; return () => { n += 0x6D2B79F5; let t = Math.imul(n ^ n >>> 15, n | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
	function shuffle(values, rng) { const a = [...values]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
	const pick = (values, rng) => values[Math.floor(rng() * values.length)];
	const unique = (values) => [...new Set(values)];
	const field = (label, accepted) => ({ label, accepted: unique(accepted), answer: accepted[0], multiline: true });
	const forms = { invite: "ませんか。", propose: "ましょう。", check: "ましょうか。" };
	function utterance(action, form, role = "", time = "") { return `${time ? time + "、" : ""}${role}${action.stem}${forms[form]}`; }
	function answers(action, intent, time = "") {
		const endings = intent === "offer" ? ["check"] : intent === "plan" ? ["propose"] : ["invite", "check"];
		const roles = intent === "offer" ? ["私が", "私が一人で", ...(action.use === "help" ? [] : ["私が代わりに"])] : ["一緒に", "二人で", "私たち二人で"];
		const times = time ? [time, time + "は", ...(time.endsWith("曜日") ? [time + "に"] : [])] : [""];
		const sentences = [];
		for (const when of times) for (const form of endings) for (const role of roles) {
			const body = action.stem + forms[form], date = when ? when + "、" : "";
			sentences.push(utterance(action, form, role, when), `${role}${date}${body}`, `${date}${action.object}${action.particle}${role}${action.before}${action.verbStem}${forms[form]}`);
		}
		const polite = sentences.flatMap((s) => [s, `じゃあ、${s}`, `それなら、${s}`, ...(intent === "plan" ? [`いいですね。${s}`, `ええ、${s}`] : [`よかったら、${s}`])]);
		return unique(polite.flatMap((s) => [s, ...(action.particle === "へ" ? [s.replace(action.object + "へ", action.object + "に")] : [])]).flatMap((s) => [s, ...(s.includes("明日") ? [s.replace("明日", "あす")] : [])]));
	}
	function create({ nounPools = {}, verbPool = [], aliases = [], seed = Date.now() } = {}) {
		const rng = random(seed), nouns = new Map(Object.values(nounPools).flat().map((n) => [n.ja, n]));
		extraNouns.forEach(([ja, kana, en]) => nouns.set(ja, { ja, kana, en }));
		const verbs = new Map([...verbPool, ...extraVerbs].map((v) => [v.ja, v]));
		const aliasesMap = new Map([...aliases, ...readings, ["いっしょ", "いっしょ"], ["明日", "あした"]]);
		const pattern = new RegExp([...aliasesMap.keys()].sort((a, b) => b.length - a.length).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "g");
		function normalize(value) {
			return String(value || "").normalize("NFKC").replace(pattern, (word) => aliasesMap.get(word)).replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/[\s。、，,.!?！？「」『』"'()（）]/g, "").toLowerCase();
		}
		const actions = frames.flatMap((frame) => frame.objects.map((word) => {
			const noun = nouns.get(word), verb = verbs.get(frame.verb);
			if (!noun || !verb) throw new Error(`Invitation vocabulary missing: ${word} / ${frame.verb}`);
			const prefix = word + frame.particle + (frame.before || "");
			return { id: `${frame.id}:${word}`, frame: frame.id, word, object: word, particle: frame.particle, before: frame.before || "", verb: frame.verb, verbStem: verb.forms.masuStem, dict: prefix + verb.forms.dictionary, stem: prefix + verb.forms.masuStem, masu: prefix + verb.forms.masu, te: prefix + verb.forms.te, use: frame.use, setting: frame.setting, problem: frame.problem, en: frame.id === "read-aloud" ? `read ${noun.en} aloud` : `${frame.en} ${noun.en}` };
		}));
		const help = actions.filter((a) => a.use !== "shared");
		const wordBank = (a, ...words) => unique([a.dict, a.masu, ...words]).join(" / ");
		function question(taskId, a, variant, content, facts = {}) {
			const task = tasks.find((t) => t.id === taskId);
			const q = { kind: task.label, ...content, meta: { engine: version, task: taskId, topic: task.topic, sourceSessionId: "invitation", difficulty: "hard", pattern: "ませんか / ましょう / ましょうか", familyKey: a.id, sceneKey: `${a.id}:${variant}`, id: `${taskId}:${a.id}:${variant}`, structure: taskId, domain: a.frame, vocabulary: [a.word, a.verb], facts: { action: a.id, ...facts } } };
			q.mode = q.fields ? "text" : "choice";
			if (q.fields) q.answer = q.fields.map((f) => f.answer).join(" / ");
			else if (!q.options.includes(q.answer) || unique(q.options).length !== q.options.length) throw new Error(`Invalid choices: ${q.meta.id}`);
			if (q.fields) {
				const intents = taskId === "two-intents" ? facts.intents : [taskId === "offer-message" || (taskId === "change-actor" && facts.actors === "speaker") ? "offer" : taskId === "accept-plan" ? "plan" : "invite"];
				const rows = intents.map((intent, i) => {
					const label = taskId === "two-intents" ? `Message ${i + 1}` : "Reply", segments = [];
					if (taskId === "accept-plan") segments.push(core.gap("Agreed day", [facts.next], [facts.first, facts.next]), "、");
					else if (taskId === "invite-message") segments.push(facts.first + "、");
					segments.push(core.gap(`${label}: participants`, intent === "offer" ? ["私が", "私が一人で"] : ["一緒に", "二人で"], ["私が", "一緒に", "あなたが"]), a.stem,
						core.gap(`${label}: ending`, intent === "offer" ? ["ましょうか"] : intent === "plan" ? ["ましょう"] : ["ませんか", "ましょうか"]), "。");
					return { label, segments };
				});
				const instructions = { "invite-message": "Complete your question to the friend in this situation.", "accept-plan": "Complete A's direct acceptance of B's proposal, not another question.", "offer-message": "Complete B's question in this situation.", "change-actor": "Revise the question to match the new situation in the passage.", "two-intents": "Complete the question for each numbered situation. Track who will act." };
				q.responseSpec = { ...core.cloze(rows, instructions[taskId]), kind: "Complete the exchange", vocabulary: `${a.dict} (${a.en})` };
				if (taskId === "two-intents") q.prompt = intents.map((intent, i) => `Message ${i + 1}: ${intent === "offer" ? "Your friend is busy. Ask whether you can take over." : "You and your friend are free. Ask whether they would like to join you."}`).join("\n");
			}
			return q;
		}
		function sharedQuestions(a, variant, days) {
			const [first, next] = days[variant % days.length];
			const q = (task, content, facts) => question(task, a, variant, content, { first, next, ...facts });
			const invited = utterance(a, "invite", "一緒に", first), counter = utterance(a, "check", "一緒に", next);
			const plan = utterance(a, "propose", "一緒に", next);
			const sharedReply = `いいですね。${plan}`;
			const chosenStatus = ["pending", "agreed", "declined", "counterproposal"][variant];
			const replies = {
				pending: "ちょっと予定を確認してから、返事をしてもいいですか。",
				agreed: `いいですね。${utterance(a, "propose", "一緒に", first)}`,
				declined: "すみません。その日は仕事があるので、無理なんです。",
				counterproposal: `${first}はちょっと。${counter}`
			};
			const statusOptions = ["まだ参加するとは答えていない。返事を待っている。", `${atDay(first)}二人ですることに賛成した。`, `${first}の誘いを断った。別の日の提案はしていない。`, `${first}は断り、${atDay(next)}一緒にすることを提案した。まだAの返事はない。`];
			const counterOptions = [
				`${first}は仕事があるんです。${utterance(a, "invite", "一緒に", next)}`,
				`${next}は仕事があるんです。${utterance(a, "invite", "一緒に", first)}`,
				`${first}は仕事があるんです。${next}、一人で${a.te}ください。`,
				`${first}は仕事があるんです。${next}、私が一人で${a.masu}。`
			];
			return [
				q("invite-message", { prompt: `You are free ${dayEnglish[first]} and would like a friend to join you. You have not asked about their plans yet.`, promptLabel: "Situation", subprompt: `Ask whether your friend would like to join you ${dayEnglish[first]}. Include the day and 一緒に (or 二人で); make it a polite invitation question, not an announcement.`, band: "Write the invitation.", vocabulary: wordBank(a, first), fields: [field("Your message", answers(a, "invite", first))], explanation: "Both ませんか and shared-action ましょうか work here. 一緒に/二人で makes the shared action explicit. ましょう is also a useful proposal, but is not the invitation question requested in this task.", english: `Would you like to ${a.en} together ${dayEnglish[first]}?` }),
				q("accept-plan", { prompt: `${a.setting}\nA：${invited}\nB：${first}は予定があるんです。${next}なら空いているんですが、どうですか。\nA：［返事］`, subprompt: "Reply as A. Accept B's new day with a full 'let's' statement, not another question. Include the new day and 一緒に (or 二人で).", band: "Accept the changed plan.", vocabulary: wordBank(a, first, next), fields: [field("A's acceptance", answers(a, "plan", next))], explanation: `B did not accept ${first}; B suggested ${next}. A's accepting ましょう statement should keep that new day and the shared action. A question would reopen the suggestion rather than give the requested direct acceptance.`, english: `Then let's ${a.en} together ${dayEnglish[next]}.` }),
				q("choose-reply", { prompt: `AとBは、二人で「${a.dict}」ことを相談しています。\nA：${invited}\nB：その日は無理ですが、${next}は空いています。\nA：私も${next}なら大丈夫です。\nB：［返事］`, subprompt: "Which reply directly proposes doing it together on the newly available day, rather than assigning it to one person?", band: "Keep both participants and the agreed day.", options: [sharedReply, `いいですね。${utterance(a, "propose", "一緒に", first)}`, `${next}、私が一人で${a.stem}ましょうか。`, `Aさん、${next}は一人で${a.te}ください。`], answer: sharedReply, choiceFacts: [{ day: next, actors: "both" }, { day: first, actors: "both" }, { day: next, actors: "B" }, { day: next, actors: "A" }], explanation: `The target is a shared proposal for ${next}. The other lines change the day or assign the action to only A or B; they are not simply ungrammatical.`, english: `Both are free ${dayEnglish[next]}; B proposes that they ${a.en} together.` }, { day: next, actors: "both" }),
				q("counterproposal", { prompt: `A：${invited}\nあなたはBです。${first}は仕事がありますが、${next}は空いています。Aと二人でしたいので、別の日に誘い直します。`, subprompt: "Which message declines the unavailable day and asks A to join you on the other day?", band: "Choose the counter-invitation, not a solo plan.", options: counterOptions, answer: counterOptions[0], choiceFacts: [{ day: next, actors: "both" }, { day: first, actors: "both" }, { day: next, actors: "A" }, { day: next, actors: "B" }], explanation: "A reason can soften a refusal, and a new ませんか invitation keeps the possibility of doing it together. Asking the other person to do it alone, or saying you will do it alone, changes that intention.", english: `I work ${dayEnglish[first]}. Would you like to ${a.en} together ${dayEnglish[next]}?` }, { day: next, actors: "both" }),
				q("scope-reading", { prompt: `A：${invited}\nB：${replies[chosenStatus]}`, subprompt: "What has B agreed to, if anything?", band: "Choose the supported interpretation.", options: statusOptions, answer: statusOptions[["pending", "agreed", "declined", "counterproposal"].indexOf(chosenStatus)], choiceFacts: ["pending", "agreed", "declined", "counterproposal"], explanation: chosenStatus === "pending" ? "Asking to check the schedule postpones the answer; it is neither acceptance nor a definite refusal." : chosenStatus === "agreed" ? "B responds with a shared ましょう statement, accepting the proposed activity and day." : chosenStatus === "declined" ? "The stated conflict and 無理なんです decline this invitation. No alternative date has been proposed." : "B declines the original day but asks about another. A has not yet accepted the counterproposal.", english: `A invites B to ${a.en} ${dayEnglish[first]}. B's response is ${chosenStatus}.` }, { status: chosenStatus })
			];
		}
		function helpQuestions(a, variant) {
			const q = (task, content, facts) => question(task, a, variant, content, facts);
			const offer = utterance(a, "check", "私が"), joint = utterance(a, "check", "一緒に");
			const status = a.use === "help" && variant === 3 ? "accepted" : ["accepted", "declined", "pending", "together"][variant];
			const reply = { accepted: pick(["はい、助かります。お願いします。私はここで待っています。", "はい、大丈夫です。お願いします。私はここで待っています。"], rng), declined: a.frame === "lend" ? "ありがとう。でも大丈夫です。もう別の人に借りたので、今は必要ありません。" : "ありがとう。でも大丈夫です。自分でできるので、お願いしなくてもいいです。", pending: "ありがとう。必要かどうか、確認してから返事をしてもいいですか。", together: "ありがとう。でも全部お願いするのではなく、二人でしましょう。" }[status];
			const statuses = ["AはBの申し出を受けた。Bがすることになった。", "AはBの申し出を断った。今はBの助けを必要としていない。", "Aはまだ決めていない。確認してから答えると言った。", "Aは全部任せず、二人ですることを提案した。Bの返事はまだない。"];
			const jointTurn = a.use === "both" && variant % 2 === 1;
			const invitation = utterance(a, variant === 1 ? "invite" : "check", "一緒に");
			const missingAnswer = jointTurn ? invitation : offer;
			const acceptance = jointTurn ? `いいですね。${utterance(a, "propose", "一緒に")}` : "ありがとうございます。Bさんにお願いします。私はここで待っています。";
			const results = [
				q("offer-message", { prompt: helpSituations[a.frame], promptLabel: "You are B", subprompt: "Ask whether A would like your help.", band: "Write B's offer.", vocabulary: wordBank(a, "私が"), fields: [field("B's offer", answers(a, "offer"))], explanation: "私が ... ましょうか offers the speaker's action and asks whether it is wanted. A joint invitation would recruit A instead. The question itself does not mean A has accepted.", english: `Shall I ${a.en} for you?` }),
				q("reply-meaning", { prompt: `B：${offer}\nA：${reply}`, subprompt: "How does A respond to B?", band: "Choose the supported interpretation.", options: statuses, answer: statuses[["accepted", "declined", "pending", "together"].indexOf(status)], choiceFacts: ["accepted", "declined", "pending", "together"], explanation: "A thank-you alone does not settle who will act. The rest of the reply either accepts B's help, explicitly declines it, postpones the decision, or proposes shared action. 大丈夫です is interpreted from its surrounding words, not as an automatic refusal.", english: `B offers to ${a.en}. A's response is ${status}.` }, { status }),
				q("missing-turn", { prompt: `B：［　］\nA：${acceptance}`, subprompt: "B asks a question; A accepts without changing who will act. Which question fits?", band: "Restore the missing turn.", options: [missingAnswer, `Aさん、${a.te}くれませんか。`, jointTurn ? offer : invitation, `私が一人で${a.masu}。`], answer: missingAnswer, choiceFacts: [jointTurn ? "both" : "B", "A", jointTurn ? "B" : "both", "statement"], explanation: jointTurn ? "A accepts doing it together, without proposing a change to B's suggestion. The joint invitation fits. A solo offer or a request for A alone would assign different participants; the statement does not meet the question requirement." : "A accepts B's action and waits. B's solo offer fits. てくれませんか asks A to act; the joint invitation recruits both people. The statement may be grammatical but is not the question specified here.", english: `B asks about whether to ${a.en}; A accepts ${jointTurn ? "doing it together" : "B's help and waits"} without changing the participants.` }, { actors: jointTurn ? "both" : "B" })
			];
			if (a.use !== "both") return results;
			const fields = shuffle(["offer", "invite"], rng);
			const toSolo = variant % 2 === 0;
			const contexts = [["solo", "joint"], ["joint", "solo"], ["solo", "solo"], ["joint", "joint"]][variant];
			const context = (kind, index) => kind === "solo" ? `A：${index ? "私は今できません。代わりにしてもらえると助かります。" : "今は手が離せないんです。お願いできますか。"}\nB：${a.stem}ましょうか。` : `A：${index ? "私もします。一人だと寂しいですから。" : "私もしたいです。そちらはどうですか。"}\nB：では、${a.stem}ましょうか。`;
			const pairFacts = [["solo", "joint"], ["joint", "solo"], ["solo", "solo"], ["joint", "joint"]];
			const pairText = (f) => f.map((r, i) => `${i + 1}：${r === "solo" ? "Bが自分の行動を申し出ている。" : "BがAと一緒にすることを提案している。"}`).join("\n");
			results.push(
				q("change-actor", { prompt: `Original: 「${toSolo ? joint : offer}」\nNew situation: ${toSolo ? "Your friend has other work to do. Ask whether you can take over." : "Your friend is free and would like to join in. Invite them instead of doing it alone."}`, subprompt: "Keep the action, but change who will act. Make a polite question.", band: "Rewrite who will act.", vocabulary: wordBank(a), fields: [field("Revised message", answers(a, toSolo ? "offer" : "invite"))], explanation: "ましょうか can appear in both readings. Changing only the ending may not change the participants: the explicit actor and the surrounding context matter. ませんか is also accepted for the rewritten joint invitation.", english: `${toSolo ? "Offer to" : "Invite the listener to"} ${a.en} ${toSolo ? "yourself instead of together" : "together instead of by yourself"}.` }, { actors: toSolo ? "speaker" : "both" }),
				q("two-intents", { prompt: "", promptLabel: "Two situations", subprompt: "Write a polite question for each situation.", band: "Keep the two intentions distinct.", vocabulary: wordBank(a), fields: fields.map((intent, i) => field(`Message ${i + 1}`, answers(a, intent))), explanation: "The same action can be a joint invitation or a solo offer. Both joint ませんか and joint ましょうか are accepted; the solo offer uses 私が ... ましょうか. Each field is checked independently.", english: `Invite someone to ${a.en} together, and separately offer to ${a.en} for a busy person.` }, { intents: fields }),
				q("context-pair", { prompt: `1\n${context(contexts[0], 0)}\n\n2\n${context(contexts[1], 1)}`, subprompt: "Who would act in each exchange? The answers may be the same or different.", band: "Interpret each question independently.", options: pairFacts.map(pairText), answer: pairText(contexts), choiceFacts: pairFacts, explanation: "ましょうか does not by itself encode 'I' or 'we'. A request to take over supports a solo offer; A's wish to participate supports a joint suggestion. Check both scenes independently: they need not have opposite answers.", english: `The question about whether to ${a.en} is ${contexts.map((c) => c === "solo" ? "a solo offer" : "a shared suggestion").join(" and then ")}.` }, { contexts })
			);
			return results;
		}
		function finalPlan(a, b, variant) {
			const [first, next] = pick(dayPairs, rng);
			const helper = variant % 2 ? "A" : "B", listener = helper === "A" ? "B" : "A";
			const preparation = b.word === "地図" ? "場所が分からない友だちにも、道を知らせたいですね。" : b.word === "資料" ? "先に使うものを、ほかの友だちにも見てもらいたいですね。" : "この予定を、ほかの友だちにもメールで知らせたいですね。";
			const helperLine = `${helper}：${preparation}${utterance(b, "check", "私が")}`;
			const alternatives = [{ day: next, helper }, { day: first, helper }, { day: next, helper: listener }, { day: next, helper: "both" }];
			const text = (f) => `${atDay(f.day)}AとBが一緒に${a.dict}。連絡の準備では、${f.helper === "both" ? "AとBが二人で" : f.helper + "が一人で"}${b.dict}。`;
			const q = question("final-plan", a, variant, {
				prompt: `${a.setting}\nA：${utterance(a, "invite", "一緒に", first)}\nB：${first}は用事があるんです。${utterance(a, "check", "一緒に", next)}\nA：いいですね。そうしましょう。\n${helperLine}\n${listener}：ありがとうございます。それはお願いします。`,
				subprompt: "Which summary preserves both the revised shared plan and who accepted responsibility for the separate preparation?", band: "Track the invitation and the offer separately.",
				options: alternatives.map(text), answer: text(alternatives[0]), choiceFacts: alternatives,
				explanation: `The original day is declined; A accepts ${next} with そうしましょう. In the separate offer, 私が refers to ${helper}, the speaker of that turn, not automatically to A. ${listener} accepts that offer.`,
				english: `A and B agree to ${a.en} together ${dayEnglish[next]}. Separately, ${helper} offers to ${b.en} for the communication preparations, and ${listener} accepts.`
			}, { day: next, helper, preparation: b.id });
			q.meta.vocabulary.push(b.word, b.verb);
			return q;
		}
		function buildBank() {
			const bank = [];
			for (const a of actions) {
				const days = shuffle(dayPairs, rng);
				for (let variant = 0; variant < 4; variant++) {
					if (a.use !== "help") bank.push(...sharedQuestions(a, variant, days));
					if (a.use !== "shared") bank.push(...helpQuestions(a, variant));
					const allowed = preparationEdges[a.frame] || ["メール"];
					if (a.use !== "help") bank.push(finalPlan(a, pick(help.filter((b) => b.frame === "send" && allowed.includes(b.word) && b.word !== a.word), rng), variant));
				}
			}
			return bank;
		}
		function grade(q, value) {
			if (q.mode === "choice") return { correct: value === q.answer, parts: [] };
			const input = Array.isArray(value) ? value : [value];
			const parts = q.fields.map((f, i) => f.accepted.some((answer) => normalize(answer) === normalize(input[i])));
			return { correct: input.length === q.fields.length && parts.every(Boolean), parts };
		}
		return { buildBank, grade, normalize, lexicon: { actions, nouns: [...nouns.values()], verbs: [...verbs.values()] } };
	}
	function selectQueue(bank, count = 25, { seed = Date.now(), recent = [] } = {}) {
		const rng = random(seed), candidates = shuffle(bank.filter((q) => q.meta?.engine === version), rng);
		const used = new Set(), history = new Set(recent), queue = [];
		const usage = { task: new Map(), topic: new Map(), domain: new Map(), vocabulary: new Map() };
		const quotas = new Map(tasks.map((t) => [t.id, Math.max(1, Math.ceil(t.count * count / 25))]));
		const bump = (map, key) => map.set(key, (map.get(key) || 0) + 1);
		while (queue.length < count) {
			let best, bestScore = Infinity;
			for (const q of candidates) {
				const m = q.meta, last = queue.at(-1)?.meta;
				if (used.has(m.familyKey)) continue;
				const taskUse = usage.task.get(m.task) || 0;
				let score = taskUse >= quotas.get(m.task) ? 10000 : 0;
				score += core.reviewBalancePenalty(q, queue, count);
				score += taskUse / quotas.get(m.task) * 100 + (usage.topic.get(m.topic) || 0) * 25;
				if (last?.task === m.task) score += 600;
				if (last?.topic === m.topic) score += 150;
				if (last?.domain === m.domain) score += 100;
				if (history.has(m.familyKey)) score += 2000;
				// Save dual-use actions for the tasks that actually contrast solo and joint action.
				if (!["change-actor", "two-intents", "context-pair"].includes(m.task) && frames.find(f => f.id === m.domain)?.use === "both") score += 300;
				score += (usage.domain.get(m.domain) || 0) * 15;
				score += m.vocabulary.reduce((sum, word) => sum + (usage.vocabulary.get(word) || 0) * 18, 0);
				if (score < bestScore) { best = q; bestScore = score; }
			}
			if (!best) break;
			queue.push({ ...best, options: best.options ? [...best.options] : undefined });
			used.add(best.meta.familyKey);
			for (const key of ["task", "topic", "domain"]) bump(usage[key], best.meta[key]);
			for (const word of best.meta.vocabulary) bump(usage.vocabulary, word);
		}
		queue.splice(0, queue.length, ...core.interleave(queue, q => q.meta.task));
		const positions = new Map();
		let lastPosition = -1, run = 0;
		for (const q of queue.filter((q) => q.options)) {
			const facts = q.choiceFacts ? new Map(q.options.map((option, i) => [option, q.choiceFacts[i]])) : null;
			const counts = positions.get(q.options.length) || Array(q.options.length).fill(0);
			const allowed = shuffle(counts.map((_, i) => i), rng).filter((i) => run < 2 || i !== lastPosition);
			const position = allowed.sort((a, b) => counts[a] - counts[b])[0];
			q.options = shuffle(q.options.filter((o) => o !== q.answer), rng);
			q.options.splice(position, 0, q.answer);
			if (facts) q.choiceFacts = q.options.map((option) => facts.get(option));
			counts[position]++; positions.set(counts.length, counts);
			run = lastPosition === position ? run + 1 : 1; lastPosition = position;
		}
		return queue;
	}
	return { version, create, selectQueue, tasks, readings, frames, extraVerbs, utterance, answers };
});
